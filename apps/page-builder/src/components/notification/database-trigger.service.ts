import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseTriggerService implements OnModuleInit {
  constructor(private prisma: PrismaPageBuilderService) {}

  async onModuleInit() {
    try {
      // Drop existing triggers for Notification and Wallet tables separately
      console.log('Dropping existing triggers if they exist...');
      await this.prisma.$executeRaw`
        DROP TRIGGER IF EXISTS notification_insert_trigger ON "Notification";
      `;
      await this.prisma.$executeRaw`
        DROP TRIGGER IF EXISTS notification_delete_trigger ON "Notification";
      `;
      await this.prisma.$executeRaw`
        DROP TRIGGER IF EXISTS wallet_insert_trigger ON "Wallet";
      `;
      await this.prisma.$executeRaw`
        DROP TRIGGER IF EXISTS wallet_delete_trigger ON "Wallet";
      `;

      // Create the function for notifications
      console.log('Creating function notify_on_change...');
      await this.prisma.$executeRaw`
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
      `;

      // Create the trigger for INSERT on the "Notification" table
      console.log('Creating INSERT trigger for "Notification" table...');
      await this.prisma.$executeRaw`
        CREATE TRIGGER notification_insert_trigger
        AFTER INSERT ON "Notification"
        FOR EACH ROW
        EXECUTE FUNCTION notify_on_change();
      `;

      // Create the trigger for DELETE on the "Notification" table
      console.log('Creating DELETE trigger for "Notification" table...');
      await this.prisma.$executeRaw`
        CREATE TRIGGER notification_delete_trigger
        AFTER DELETE ON "Notification"
        FOR EACH ROW
        EXECUTE FUNCTION notify_on_change();
      `;

      // Create the trigger for INSERT on the "Wallet" table
      console.log('Creating INSERT trigger for "Wallet" table...');
      await this.prisma.$executeRaw`
        CREATE TRIGGER wallet_insert_trigger
        AFTER INSERT ON "Wallet"
        FOR EACH ROW
        EXECUTE FUNCTION notify_on_change();
      `;

      // Create the trigger for DELETE on the "Wallet" table
      console.log('Creating DELETE trigger for "Wallet" table...');
      await this.prisma.$executeRaw`
        CREATE TRIGGER wallet_delete_trigger
        AFTER DELETE ON "Wallet"
        FOR EACH ROW
        EXECUTE FUNCTION notify_on_change();
      `;

      // Insert a test row into "Notification" to trigger the notification
      console.log(
        'Inserting test row into "Notification" table to trigger notification...',
      );
      await this.prisma.notification.create({
        data: {
          userId: 1,
          message: 'Test message for notification',
          type: 'info',
        },
      });

      // Insert a test row into "Wallet" to trigger the notification
      console.log(
        'Inserting test row into "Wallet" table to trigger notification...',
      );
      await this.prisma.wallet.create({
        data: {
          wallet_total_balance: '8000',
          user_id: '9',
        },
      });

      console.log(
        'Test rows inserted. Check the logs for notification results.',
      );
    } catch (error) {
      console.error('Error during trigger initialization or test:', error);
    }
  }
}
