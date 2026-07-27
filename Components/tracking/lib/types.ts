export interface EmailLog {
  currentStatus: string;
  subject: string;
  sentAt: string;
  emailType: string;
  recipients: any[];
  rawEvents: any[];
}