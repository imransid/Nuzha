import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationListenerService implements OnModuleInit {
  private client: Client;

  constructor(private notificationService: NotificationService) {}

  async onModuleInit() {
    try {
      console.log('Initializing Notification Listener Service...');

      // Create a new instance of the client and use the correct database connection string
      this.client = new Client({
        connectionString: process.env.PAGE_BUILDER_DATABASE_URI, // Ensure this is correct
      });

      console.log('Connecting to PostgreSQL...');
      await this.client.connect(); // This attempts to establish a connection
      console.log('Connected to PostgreSQL!'); // Confirm connection success

      await this.client.query('LISTEN notification_channel');
      console.log('Listening for notifications on "notification_channel"...');

      // Handling the notification when received
      this.client.on('notification', async (msg) => {
        try {
          const payload = JSON.parse(msg.payload);

          console.log('msg', msg);

          let message = '';
          let userID = payload.data.user_id || -1;
          const tableName = payload.table;

          switch (payload.action) {
            case 'INSERT':
              message = `A new ${tableName} record has been successfully added.`;
              break;
            case 'UPDATE':
              message = `The ${tableName} record has been updated successfully.`;
              break;
            case 'DELETE':
              message = `A ${tableName} record has been deleted.`;
              break;
            default:
              message = `An unknown action occurred on the ${tableName} table.`;
          }

          console.log('New notification created:', message);
          // Create the notification

          if (tableName !== 'Notification') {
            await this.notificationService.create({
              userId: parseInt(userID),
              message: message,
              type: 'info',
            });
          }

          console.log('New notification created:', message);
        } catch (error) {
          console.error('Error parsing notification payload:', error);
        }
      });
    } catch (error) {
      console.error('Error in NotificationListenerService:', error); // This logs any connection errors
    }
  }
}
