import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseTriggerService implements OnModuleInit {
  constructor(private prisma: PrismaPageBuilderService) {}

  async onModuleInit() {
    try {
      // Drop PropertyData triggers
      await this.prisma.$executeRawUnsafe(`
        DROP TRIGGER IF EXISTS propertyData_insert_trigger ON "PropertyData";
      `);
      await this.prisma.$executeRawUnsafe(`
        DROP TRIGGER IF EXISTS propertyData_delete_trigger ON "PropertyData";
      `);

      // Drop Wallet triggers
      await this.prisma.$executeRawUnsafe(`
              DROP TRIGGER IF EXISTS wallet_insert_trigger ON "Wallet";
            `);
      await this.prisma.$executeRawUnsafe(`
              DROP TRIGGER IF EXISTS wallet_delete_trigger ON "Wallet";
            `);

      // Drop Booking triggers
      await this.prisma.$executeRawUnsafe(`
        DROP TRIGGER IF EXISTS booking_insert_trigger ON "Booking";
      `);
      await this.prisma.$executeRawUnsafe(`
        DROP TRIGGER IF EXISTS booking_delete_trigger ON "Booking";
      `);

      // Drop Transaction triggers
      await this.prisma.$executeRawUnsafe(`
              DROP TRIGGER IF EXISTS transaction_insert_trigger ON "Transaction";
            `);
      await this.prisma.$executeRawUnsafe(`
              DROP TRIGGER IF EXISTS transaction_delete_trigger ON "Transaction";
            `);

      // Create the function for notifications
      console.log('Creating function notify_on_change...');
      await this.prisma.$executeRawUnsafe(`
        CREATE OR REPLACE FUNCTION notify_on_change()
        RETURNS trigger AS $$
        DECLARE
          response json;
        BEGIN
          -- Create a payload that includes table name and action type (INSERT, UPDATE, DELETE)
          PERFORM pg_notify('notification_channel', 
            json_build_object(
              'action', TG_OP,  -- Operation (INSERT, UPDATE, DELETE)
              'table', TG_TABLE_NAME,  -- Table name
              'data', row_to_json(NEW)  -- Row data (NEW for INSERT/UPDATE, OLD for DELETE)
            )::text
          );
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);

      // Create insert trigger for the Transaction table
      console.log('Creating insert trigger for Transaction table...');
      await this.prisma.$executeRawUnsafe(`
        CREATE TRIGGER transaction_insert_trigger
        AFTER INSERT ON "Transaction"
        FOR EACH ROW
        EXECUTE FUNCTION notify_on_change();
      `);

      // Create delete trigger for the Transaction table
      console.log('Creating delete trigger for Transaction table...');
      await this.prisma.$executeRawUnsafe(`
        CREATE TRIGGER transaction_delete_trigger
        AFTER DELETE ON "Transaction"
        FOR EACH ROW
        EXECUTE FUNCTION notify_on_change();
      `);

      // Create insert trigger for the Booking table
      console.log('Creating insert trigger for Booking table...');
      await this.prisma.$executeRawUnsafe(`
        CREATE TRIGGER booking_insert_trigger
        AFTER INSERT ON "Booking"
        FOR EACH ROW
        EXECUTE FUNCTION notify_on_change();
      `);

      // Create delete trigger for the Booking table
      console.log('Creating delete trigger for Booking table...');
      await this.prisma.$executeRawUnsafe(`
        CREATE TRIGGER booking_delete_trigger
        AFTER DELETE ON "Booking"
        FOR EACH ROW
        EXECUTE FUNCTION notify_on_change();
      `);

      // Create insert trigger for the PropertyData table
      console.log('Creating insert trigger for PropertyData table...');
      await this.prisma.$executeRawUnsafe(`
              CREATE TRIGGER propertyData_insert_trigger
              AFTER INSERT ON "PropertyData"
              FOR EACH ROW
              EXECUTE FUNCTION notify_on_change();
            `);

      // Create delete trigger for the PropertyData table
      console.log('Creating delete trigger for PropertyData table...');
      await this.prisma.$executeRawUnsafe(`
              CREATE TRIGGER propertyData_delete_trigger
              AFTER DELETE ON "PropertyData"
              FOR EACH ROW
              EXECUTE FUNCTION notify_on_change();
            `);

      // Create insert trigger for the Wallet table
      console.log('Creating insert trigger for Wallet table...');
      await this.prisma.$executeRawUnsafe(`
        CREATE TRIGGER wallet_insert_trigger
        AFTER INSERT ON "Wallet"
        FOR EACH ROW
        EXECUTE FUNCTION notify_on_change();
      `);

      // Create delete trigger for the Wallet table
      console.log('Creating delete trigger for Wallet table...');
      await this.prisma.$executeRawUnsafe(`
        CREATE TRIGGER wallet_delete_trigger
        AFTER DELETE ON "Wallet"
        FOR EACH ROW
        EXECUTE FUNCTION notify_on_change();
      `);

      // Insert a test row into the Wallet table to trigger the notification
      console.log(
        'Inserting test row into Wallet table to trigger notification...',
      );
      await this.prisma.wallet.create({
        data: {
          wallet_total_balance: '0000',
          user_id: '0', // Replace with a valid user ID
        },
      });

      console.log(
        'Test row inserted. Check the logs for notification results.',
      );
    } catch (error) {
      console.error('Error during trigger initialization or test:', error);
    }
  }
}
