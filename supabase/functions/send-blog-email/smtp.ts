// SMTP email sender using denomailer (Deno-compatible nodemailer alternative)
import { SmtpClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

export interface EmailConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  from: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmailViaSMTP(
  config: EmailConfig,
  message: EmailMessage
): Promise<void> {
  const client = new SmtpClient();

  try {
    await client.connectTLS({
      hostname: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
    });

    await client.send({
      from: config.from,
      to: message.to,
      subject: message.subject,
      content: message.text || "",
      html: message.html,
    });

    await client.close();
  } catch (error) {
    await client.close();
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
