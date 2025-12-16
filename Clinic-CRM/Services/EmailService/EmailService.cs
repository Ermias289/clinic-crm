using System.Net.Mail;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;

namespace Clinic_CRM.Services.EmailService
{
      public class EmailService : IEmailService
      {
            private readonly string _smtpServer = "mail.nexabusinessgroup.com";
            private readonly int _smtpPort = 465; // SSL/TLS
            private readonly string _username = "nexa-tech@nexabusinessgroup.com";
            private readonly string _password = "nexa12345@tech"; // cPanel email password

            public async Task<bool> SendEmailAsync(string recipientEmail, string subject, string body, bool isHtml = false)
            {
                var message = new MimeMessage();
                message.From.Add(MailboxAddress.Parse(_username));
                message.To.Add(MailboxAddress.Parse(recipientEmail));
                message.Subject = subject;
                message.Body = new TextPart(isHtml ? "html" : "plain")
                {
                    Text = body
                };

                using var smtp = new MailKit.Net.Smtp.SmtpClient();
                await smtp.ConnectAsync(_smtpServer, _smtpPort, true); // SSL
                await smtp.AuthenticateAsync(_username, _password);
                await smtp.SendAsync(message);
                await smtp.DisconnectAsync(true);

                return true;
            }
      }
}
