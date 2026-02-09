import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { sendEmailViaSMTP } from "./smtp.ts";

serve(async (req) => {
  try {
    // Get the blog post data from the request
    const { record } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get SMTP credentials from Supabase secrets
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const smtpFromEmail = Deno.env.get("SMTP_FROM_EMAIL") || Deno.env.get("SMTP_USER");
    const smtpFromName = Deno.env.get("SMTP_FROM_NAME") || "Taia Blog";

    console.log("SMTP Configuration:", {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser ? "***" : "missing",
      password: smtpPassword ? "***" : "missing",
      fromEmail: smtpFromEmail,
      fromName: smtpFromName,
    });

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !smtpFromEmail) {
      const missing = [];
      if (!smtpHost) missing.push("SMTP_HOST");
      if (!smtpPort) missing.push("SMTP_PORT");
      if (!smtpUser) missing.push("SMTP_USER");
      if (!smtpPassword) missing.push("SMTP_PASSWORD");
      if (!smtpFromEmail) missing.push("SMTP_FROM_EMAIL");
      throw new Error(`Missing SMTP credentials: ${missing.join(", ")}`);
    }

    // Fetch all users who want to receive blog notifications
    // First, try to get all users with email addresses to see what we have
    const { data: allUsers, error: allUsersError } = await supabase
      .from("user_profiles")
      .select("email, name, blog_notifications")
      .not("email", "is", null);

    console.log("All users with emails:", {
      count: allUsers?.length || 0,
      users: allUsers?.map(u => ({ email: u.email, hasNotifications: u.blog_notifications })),
    });

    // Now fetch subscribers with blog_notifications = true
    const { data: subscribers, error: subscribersError } = await supabase
      .from("user_profiles")
      .select("email, name")
      .eq("blog_notifications", true)
      .not("email", "is", null);

    console.log("Subscribers query result:", {
      count: subscribers?.length || 0,
      error: subscribersError?.message || null,
    });

    if (subscribersError) {
      console.error("Error fetching subscribers:", subscribersError);
      // Don't throw, just log and return
      return new Response(
        JSON.stringify({ 
          message: "Blog created but subscriber query failed",
          error: subscribersError.message 
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subscribers to notify" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create the email HTML content
    const emailHtml = generateEmailHtml(record);
    const emailText = generateEmailText(record);

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        await sendEmailViaSMTP(
          {
            host: smtpHost,
            port: parseInt(smtpPort),
            username: smtpUser,
            password: smtpPassword,
            from: `${smtpFromName} <${smtpFromEmail}>`,
          },
          {
            to: subscriber.email,
            subject: `New Blog Post: ${record.title}`,
            html: emailHtml.replace("{{subscriber_name}}", subscriber.name || "Reader"),
            text: emailText.replace("{{subscriber_name}}", subscriber.name || "Reader"),
          }
        );
        
        console.log(`Email sent to ${subscriber.email}`);
        return { email: subscriber.email, success: true };
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        return { email: subscriber.email, success: false, error: error.message };
      }
    });

    const results = await Promise.allSettled(emailPromises);
    
    const successCount = results.filter(r => r.status === "fulfilled").length;
    const failureCount = results.filter(r => r.status === "rejected").length;

    return new Response(
      JSON.stringify({
        message: "Blog notification emails processed",
        totalSubscribers: subscribers.length,
        successCount,
        failureCount,
        results: results.map(r => r.status === "fulfilled" ? r.value : { error: r.reason }),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-blog-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

// Generate HTML email template
function generateEmailHtml(blogPost: any): string {
  const baseUrl = Deno.env.get("PUBLIC_SITE_URL") || "https://yoursite.com";
  const blogUrl = `${baseUrl}/blog/${blogPost.slug}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${blogPost.title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        h1 {
          color: #1f2937;
          font-size: 28px;
          margin-bottom: 20px;
        }
        .meta {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .excerpt {
          color: #4b5563;
          font-size: 16px;
          margin-bottom: 30px;
          line-height: 1.8;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #2563eb;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        .footer a {
          color: #2563eb;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Taia Blog</div>
          <p style="color: #6b7280;">New Post Published</p>
        </div>
        
        <h1>${blogPost.title}</h1>
        
        <div class="meta">
          Published on ${new Date(blogPost.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
          ${blogPost.author ? ` • By ${blogPost.author}` : ''}
        </div>
        
        <div class="excerpt">
          ${blogPost.excerpt || blogPost.description || 'Check out our latest blog post!'}
        </div>
        
        <div style="text-align: center;">
          <a href="${blogUrl}" class="button">Read Full Article</a>
        </div>
        
        <div class="footer">
          <p>Hi {{subscriber_name}},</p>
          <p>You're receiving this email because you subscribed to blog updates from Taia.</p>
          <p><a href="${baseUrl}/profile">Manage your email preferences</a> • <a href="${baseUrl}">Visit our website</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate plain text email version
function generateEmailText(blogPost: any): string {
  const baseUrl = Deno.env.get("PUBLIC_SITE_URL") || "https://yoursite.com";
  const blogUrl = `${baseUrl}/blog/${blogPost.slug}`;
  
  return `
NEW BLOG POST: ${blogPost.title}

Published on ${new Date(blogPost.created_at).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}${blogPost.author ? ` • By ${blogPost.author}` : ''}

${blogPost.excerpt || blogPost.description || 'Check out our latest blog post!'}

Read the full article here:
${blogUrl}

---

Hi {{subscriber_name}},

You're receiving this email because you subscribed to blog updates from Taia.

Manage your email preferences: ${baseUrl}/profile
Visit our website: ${baseUrl}
  `.trim();
}
