import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  try {
    let transporter;

    // Check if SMTP config exists
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      const isGmail = process.env.SMTP_HOST.includes('gmail.com');

      if (isGmail) {
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      } else {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      }
    } else {
      // Dynamic Ethereal mail account fallback for testing
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"VisitHub" <admin.visithub@gmail.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email dispatched to [${options.to}] | Subject: "${options.subject}" | Message ID: ${info.messageId}`);
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`Ethereal Test Mail Preview URL: ${previewUrl}`);
      return { messageId: info.messageId, previewUrl };
    }

    return { messageId: info.messageId };
  } catch (error) {
    console.warn(`Nodemailer dispatch notification (non-blocking): ${error.message}`);
    return null;
  }
};

// 1. Receptionist created visitor request email
export const sendVisitorCreatedEmail = async (visitor, host) => {
  const subject = `Your Visitor Request Has Been Created Successfully (${visitor.pass_code})`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
      <div style="background: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 1.5rem;">Visit<span style="color: #00bcd4;">Hub</span></h1>
        <p style="margin: 6px 0 0 0; font-size: 0.9rem; color: #94a3b8;">Visitor Entry Pass Confirmation</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #062132; margin-top: 0;">Visitor Request Created Successfully</h2>
        <p>Dear <strong>${visitor.name}</strong>,</p>
        <p>Your visitor registration pass has been successfully recorded in the system. Below are your visit details:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Pass Code:</strong> <span style="color: #00bcd4; font-family: monospace; font-size: 1.2rem; font-weight: bold;">${visitor.pass_code}</span></p>
          <p style="margin: 4px 0;"><strong>Visitor Name:</strong> ${visitor.name}</p>
          <p style="margin: 4px 0;"><strong>Host Employee:</strong> ${host?.name || 'Assigned Host'} (${host?.department || 'Staff'})</p>
          <p style="margin: 4px 0;"><strong>Scheduled Visit Date:</strong> ${visitor.schedule_date}</p>
          <p style="margin: 4px 0;"><strong>Expected Arrival Time:</strong> ${visitor.expected_arrival_time}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="background: #fffbeb; color: #b45309; padding: 2px 8px; border-radius: 4px; font-weight: bold;">Pending Host Approval</span></p>
        </div>
        
        <p style="font-size: 0.875rem; color: #64748b;">Please keep your Pass Code <strong>${visitor.pass_code}</strong> handy when arriving at reception.</p>
      </div>
    </div>
  `;

  await sendEmail({ to: visitor.email, subject, html });
  if (host?.email) {
    await sendEmail({
      to: host.email,
      subject: `New Visitor Request Pending Approval: ${visitor.name} (${visitor.pass_code})`,
      html
    });
  }
};

// 2. Employee Approved visitor entry email
export const sendVisitorApprovedEmail = async (visitor, host) => {
  const subject = `Your Visitor entry has been Approved`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
      <div style="background: #10b981; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 1.5rem;">Visit<span style="color: #ffffff;">Hub</span></h1>
        <p style="margin: 6px 0 0 0; font-size: 0.9rem; opacity: 0.9;">Visit Entry Authorization Status</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #10b981; margin-top: 0;">Your Visitor entry has been Approved</h2>
        <p>Dear <strong>${visitor.name}</strong>,</p>
        <p>Great news! Your host employee <strong>${host?.name || 'your host'}</strong> has <strong>APPROVED</strong> your visit request.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; border: 1px solid #bbf7d0; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Pass Code:</strong> <span style="color: #10b981; font-family: monospace; font-size: 1.2rem; font-weight: bold;">${visitor.pass_code}</span></p>
          <p style="margin: 4px 0;"><strong>Host Employee:</strong> ${host?.name || 'Assigned Host'}</p>
          <p style="margin: 4px 0;"><strong>Visit Date:</strong> ${visitor.schedule_date}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="background: #d1fae5; color: #047857; padding: 2px 8px; border-radius: 4px; font-weight: bold;">✅ Approved for Entry</span></p>
          ${visitor.remarks ? `<p style="margin: 4px 0;"><strong>Host Note:</strong> ${visitor.remarks}</p>` : ''}
        </div>
        
        <p style="font-size: 0.875rem; color: #64748b;">You are now authorized to check in at reception on your scheduled visit date.</p>
      </div>
    </div>
  `;

  await sendEmail({ to: visitor.email, subject, html });
};

// 3. Employee Rejected visitor entry email
export const sendVisitorRejectedEmail = async (visitor, host) => {
  const subject = `Your Visitor entry has been Rejected`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
      <div style="background: #ef4444; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 1.5rem;">Visit<span style="color: #ffffff;">Hub</span></h1>
        <p style="margin: 6px 0 0 0; font-size: 0.9rem; opacity: 0.9;">Visit Entry Authorization Status</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #ef4444; margin-top: 0;">Your Visitor entry has been Rejected</h2>
        <p>Dear <strong>${visitor.name}</strong>,</p>
        <p>We regret to inform you that your visit request (Pass Code: <strong>${visitor.pass_code}</strong>) has been <strong>REJECTED</strong> by your host employee <strong>${host?.name || 'your host'}</strong>.</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 10px; border: 1px solid #fecaca; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Pass Code:</strong> <span style="color: #ef4444; font-family: monospace; font-size: 1.2rem; font-weight: bold;">${visitor.pass_code}</span></p>
          <p style="margin: 4px 0;"><strong>Host Employee:</strong> ${host?.name || 'Assigned Host'}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="background: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 4px; font-weight: bold;">❌ Rejected</span></p>
          ${visitor.remarks ? `<p style="margin: 4px 0;"><strong>Rejection Reason:</strong> ${visitor.remarks}</p>` : ''}
        </div>
        
        <p style="font-size: 0.875rem; color: #64748b;">If you believe this is in error, please contact your host employee directly.</p>
      </div>
    </div>
  `;

  await sendEmail({ to: visitor.email, subject, html });
};

// 4. Receptionist Checked In visitor email
export const sendVisitorCheckedInEmail = async (visitor, host) => {
  const subject = `Your Visitor entry has been Checked In`;
  const timeStr = visitor.check_in_time ? new Date(visitor.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
      <div style="background: #00bcd4; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 1.5rem;">Visit<span style="color: #ffffff;">Hub</span></h1>
        <p style="margin: 6px 0 0 0; font-size: 0.9rem; opacity: 0.9;">Check-In Confirmation Notification</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #00bcd4; margin-top: 0;">Your Visitor entry has been Checked In</h2>
        <p>Dear <strong>${visitor.name}</strong>,</p>
        <p>Your arrival has been recorded and verified by the Reception desk.</p>
        
        <div style="background: #f0fdfa; padding: 20px; border-radius: 10px; border: 1px solid #99f6e4; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Pass Code:</strong> <span style="color: #00bcd4; font-family: monospace; font-size: 1.2rem; font-weight: bold;">${visitor.pass_code}</span></p>
          <p style="margin: 4px 0;"><strong>Check-In Time:</strong> ${timeStr}</p>
          <p style="margin: 4px 0;"><strong>Host Employee:</strong> ${host?.name || 'Assigned Host'}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="background: #ccfbf1; color: #0f766e; padding: 2px 8px; border-radius: 4px; font-weight: bold;">🎟️ Checked In</span></p>
        </div>
        
        <p style="font-size: 0.875rem; color: #64748b;">Your host employee has been notified of your arrival. Please wear your visitor badge at all times while on premises.</p>
      </div>
    </div>
  `;

  await sendEmail({ to: visitor.email, subject, html });
  if (host?.email) {
    await sendEmail({
      to: host.email,
      subject: `Visitor Arrival Notification: ${visitor.name} (${visitor.pass_code}) has Checked In`,
      html
    });
  }
};

// 5. Receptionist Checked Out visitor email
export const sendVisitorCheckedOutEmail = async (visitor, host) => {
  const subject = `Your Visitor entry has been Checked Out`;
  const timeStr = visitor.check_out_time ? new Date(visitor.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
      <div style="background: #64748b; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 1.5rem;">Visit<span style="color: #ffffff;">Hub</span></h1>
        <p style="margin: 6px 0 0 0; font-size: 0.9rem; opacity: 0.9;">Check-Out Confirmation Notification</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #334155; margin-top: 0;">Your Visitor entry has been Checked Out</h2>
        <p>Dear <strong>${visitor.name}</strong>,</p>
        <p>Thank you for visiting us! Your check-out departure timestamp has been recorded by reception.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #cbd5e1; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Pass Code:</strong> <span style="color: #475569; font-family: monospace; font-size: 1.2rem; font-weight: bold;">${visitor.pass_code}</span></p>
          <p style="margin: 4px 0;"><strong>Check-Out Time:</strong> ${timeStr}</p>
          <p style="margin: 4px 0;"><strong>Host Employee:</strong> ${host?.name || 'Assigned Host'}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="background: #e2e8f0; color: #334155; padding: 2px 8px; border-radius: 4px; font-weight: bold;">🚪 Checked Out</span></p>
        </div>
        
        <p style="font-size: 0.875rem; color: #64748b;">We hope you had a pleasant visit!</p>
      </div>
    </div>
  `;

  await sendEmail({ to: visitor.email, subject, html });
};

// 6. Visitor Pass Cancelled Email Notification
export const sendVisitorCancelledEmail = async (visitor, host) => {
  const subject = `Your Visitor entry has been Cancelled`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
      <div style="background: #f59e0b; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 1.5rem;">Visit<span style="color: #ffffff;">Hub</span></h1>
        <p style="margin: 6px 0 0 0; font-size: 0.9rem; opacity: 0.9;">Visit Entry Pass Cancellation</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #d97706; margin-top: 0;">Your Visitor entry has been Cancelled</h2>
        <p>Dear <strong>${visitor.name}</strong>,</p>
        <p>Your scheduled visitor entry pass (Pass Code: <strong>${visitor.pass_code}</strong>) has been <strong>CANCELLED</strong>.</p>
        
        <div style="background: #fffbeb; padding: 20px; border-radius: 10px; border: 1px solid #fde68a; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Pass Code:</strong> <span style="color: #d97706; font-family: monospace; font-size: 1.2rem; font-weight: bold;">${visitor.pass_code}</span></p>
          <p style="margin: 4px 0;"><strong>Host Employee:</strong> ${host?.name || 'Assigned Host'}</p>
          <p style="margin: 4px 0;"><strong>Scheduled Visit Date:</strong> ${visitor.schedule_date}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-weight: bold;">🚫 Cancelled</span></p>
        </div>
        
        <p style="font-size: 0.875rem; color: #64748b;">If you need to schedule a new visit, please contact your host employee or reception desk.</p>
      </div>
    </div>
  `;

  await sendEmail({ to: visitor.email, subject, html });
  if (host?.email) {
    await sendEmail({
      to: host.email,
      subject: `Visitor Cancellation Notice: Pass ${visitor.pass_code} for ${visitor.name} Cancelled`,
      html
    });
  }
};

export default sendEmail;
