import smtplib
from email.message import EmailMessage

from app.core.config import (
    SMTP_FROM_ADDRESS,
    SMTP_FROM_NAME,
    SMTP_HOST,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_USE_SSL,
    SMTP_USER,
)
from app.core.exceptions import ValidationException


def send_verification_email(to_email: str, code: str):
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        raise ValidationException(
            "Konfigurasi SMTP belum tersedia. Set SMTP_HOST, SMTP_USER, dan SMTP_PASSWORD."
        )

    message = EmailMessage()
    message["Subject"] = "Kode Verifikasi Akun Manajemen Mahasiswa"
    message["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM_ADDRESS}>"
    message["To"] = to_email

    message.set_content(
        f"""
        Halo,

        Kode verifikasi akun kamu adalah:

        {code}

        Kode ini berlaku selama 1 menit.
        Jika kamu tidak merasa melakukan registrasi, abaikan email ini.

        Terima kasih.
        """
    )

    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Kode Verifikasi</title>
    </head>
    <body style="margin:0; padding:0; background:#FFF7D6; font-family:Arial, Helvetica, sans-serif; color:#111827;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF7D6; padding:32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border:4px solid #000000; border-radius:28px; box-shadow:10px 10px 0 #000000; overflow:hidden;">
              <tr>
                <td style="background:#FFDE59; border-bottom:4px solid #000000; padding:28px;">
                  <div style="display:inline-block; background:#4ADE80; border:4px solid #000000; border-radius:18px; padding:12px 16px; font-weight:900; box-shadow:5px 5px 0 #000000;">
                    🎓 Manajemen Mahasiswa
                  </div>
                  <h1 style="margin:24px 0 8px; font-size:32px; line-height:1.05; font-weight:900; color:#111827;">
                    Verifikasi Email Kamu
                  </h1>
                  <p style="margin:0; font-size:15px; line-height:1.6; font-weight:700; color:#111827;">
                    Gunakan kode di bawah ini untuk menyelesaikan proses registrasi akun admin.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:28px;">
                  <p style="margin:0 0 18px; font-size:16px; line-height:1.6; font-weight:700;">Halo 👋</p>
                  <p style="margin:0 0 22px; font-size:15px; line-height:1.7; color:#374151;">
                    Terima kasih sudah melakukan registrasi. Masukkan kode verifikasi berikut pada halaman verifikasi email.
                  </p>
                  <div style="background:#C4B5FD; border:4px solid #000000; border-radius:22px; padding:22px; text-align:center; box-shadow:6px 6px 0 #000000; margin:24px 0;">
                    <p style="margin:0 0 10px; font-size:12px; font-weight:900; letter-spacing:1.5px; text-transform:uppercase;">Kode Verifikasi</p>
                    <div style="display:inline-block; background:#ffffff; border:4px solid #000000; border-radius:18px; padding:14px 24px; font-size:36px; font-weight:900; letter-spacing:8px; color:#111827; box-shadow:5px 5px 0 #000000;">
                      {code}
                    </div>
                  </div>
                  <div style="background:#FFDE59; border:4px solid #000000; border-radius:20px; padding:16px; box-shadow:5px 5px 0 #000000;">
                    <p style="margin:0; font-size:14px; line-height:1.6; font-weight:800;">⚠️ Kode ini berlaku selama 1 menit.</p>
                  </div>
                  <p style="margin:24px 0 0; font-size:14px; line-height:1.7; color:#4B5563;">
                    Kalau kamu tidak merasa melakukan registrasi akun, abaikan email ini. Jangan berikan kode ini kepada siapa pun.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background:#111827; padding:20px 28px; border-top:4px solid #000000;">
                  <p style="margin:0; font-size:13px; line-height:1.6; color:#ffffff; font-weight:700;">Email otomatis dari sistem Manajemen Data Mahasiswa.</p>
                  <p style="margin:6px 0 0; font-size:12px; color:#D1D5DB;">Jangan membalas email ini.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    message.add_alternative(html_content, subtype="html")

    try:
        if SMTP_USE_SSL:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as smtp:
                smtp.login(SMTP_USER, SMTP_PASSWORD)
                smtp.send_message(message)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
                smtp.ehlo()
                smtp.starttls()
                smtp.ehlo()
                smtp.login(SMTP_USER, SMTP_PASSWORD)
                smtp.send_message(message)
    except Exception as error:
        raise ValidationException(f"Gagal mengirim email verifikasi: {error}")
