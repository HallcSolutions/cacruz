/** Escapa el contenido del visitante: nunca se inyecta HTML crudo en el correo. */
export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Los saltos de línea del mensaje se conservan en el HTML. */
export function toParagraphs(message) {
  return message
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p style="margin:0 0 14px;">${escapeHtml(block).replace(/\n/g, '<br />')}</p>`)
    .join('');
}

/** Acuse de recibo para el visitante: mismo lenguaje visual, tono cercano. */
export function renderAckHtml({ name, message }, receivedAt) {
  const safeName = escapeHtml(name.trim().split(/\s+/)[0]);

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#0a0a0b;font-family:-apple-system,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#15151a;border:1px solid #2c2c30;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="padding:20px 24px;border-bottom:1px solid #2c2c30;">
          <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#a78bfa;"></span>
          <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#2c2c30;margin-left:5px;"></span>
          <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#2c2c30;margin-left:5px;"></span>
          <span style="margin-left:14px;font-family:ui-monospace,Consolas,monospace;font-size:12px;color:#f5f5f4;">mensaje-recibido.md</span>
        </td>
      </tr>
      <tr>
        <td style="padding:26px 24px 8px;">
          <p style="margin:0 0 6px;font-family:ui-monospace,Consolas,monospace;font-size:12px;color:#a78bfa;letter-spacing:0.08em;">$ ./confirmar --a ${safeName}</p>
          <h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:26px;line-height:1.3;color:#f5f5f4;font-weight:400;">
            <span style="color:#a78bfa;">#</span> ¡Gracias por escribirme, ${safeName}!
          </h1>

          <p style="margin:0 0 14px;color:#c9c9ce;font-size:15px;line-height:1.75;">
            Tu mensaje ya está en mi bandeja y es un placer que te hayas tomado el tiempo de contarme.
            Lo leo con calma y te respondo personalmente, normalmente dentro de las próximas 24 horas.
          </p>

          <p style="margin:0 0 20px;color:#9d9da2;font-size:14px;line-height:1.7;">
            Mientras tanto, esto es lo que me enviaste:
          </p>

          <div style="padding-left:14px;border-left:3px solid #a78bfa;color:#c9c9ce;font-size:14px;line-height:1.7;">
            ${toParagraphs(message)}
          </div>

          <p style="margin:22px 0 0;font-family:ui-monospace,Consolas,monospace;font-size:12px;color:#6f6f77;">
            recibido: ${escapeHtml(receivedAt)}
          </p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
            <tr>
              <td style="padding-right:8px;">
                <a href="https://github.com/ChristianCruzArango" style="display:inline-block;padding:9px 18px;border:1px solid #2c2c30;border-radius:999px;color:#c9c9ce;font-size:13px;text-decoration:none;">GitHub</a>
              </td>
              <td style="padding-right:8px;">
                <a href="https://www.linkedin.com/in/christian-alexis-cruz-arango/" style="display:inline-block;padding:9px 18px;border:1px solid #2c2c30;border-radius:999px;color:#c9c9ce;font-size:13px;text-decoration:none;">LinkedIn</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px 24px;border-top:1px solid #2c2c30;margin-top:10px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:15px;color:#f5f5f4;">Christian Cruz Arango</p>
          <p style="margin:2px 0 0;font-family:ui-monospace,Consolas,monospace;font-size:11px;color:#6f6f77;">
            Senior Full-Stack Developer · AI Engineer — cacruz.com
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Cuerpo HTML del correo, con la identidad del sitio. */
export function renderEmailHtml({ name, email, message }, receivedAt) {
  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#0a0a0b;font-family:-apple-system,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#15151a;border:1px solid #2c2c30;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="padding:20px 24px;border-bottom:1px solid #2c2c30;">
          <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#a78bfa;"></span>
          <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#2c2c30;margin-left:5px;"></span>
          <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#2c2c30;margin-left:5px;"></span>
          <span style="margin-left:14px;font-family:ui-monospace,Consolas,monospace;font-size:12px;color:#f5f5f4;">nuevo-contacto.md</span>
        </td>
      </tr>
      <tr>
        <td style="padding:26px 24px 8px;">
          <p style="margin:0 0 6px;font-family:ui-monospace,Consolas,monospace;font-size:12px;color:#a78bfa;letter-spacing:0.08em;">CACRUZ.COM · NUEVO MENSAJE</p>
          <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;line-height:1.25;color:#f5f5f4;font-weight:400;">
            <span style="color:#a78bfa;">#</span> ${safeName} quiere hablar contigo
          </h1>

          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:22px;font-family:ui-monospace,Consolas,monospace;font-size:13px;">
            <tr>
              <td style="padding:8px 0;border-top:1px solid #2c2c30;color:#9d9da2;width:90px;">nombre</td>
              <td style="padding:8px 0;border-top:1px solid #2c2c30;color:#f5f5f4;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-top:1px solid #2c2c30;color:#9d9da2;">correo</td>
              <td style="padding:8px 0;border-top:1px solid #2c2c30;">
                <a href="mailto:${safeEmail}" style="color:#a78bfa;text-decoration:none;">${safeEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-top:1px solid #2c2c30;border-bottom:1px solid #2c2c30;color:#9d9da2;">recibido</td>
              <td style="padding:8px 0;border-top:1px solid #2c2c30;border-bottom:1px solid #2c2c30;color:#9d9da2;">${escapeHtml(receivedAt)}</td>
            </tr>
          </table>

          <div style="padding-left:14px;border-left:3px solid #a78bfa;color:#c9c9ce;font-size:15px;line-height:1.7;">
            ${toParagraphs(message)}
          </div>

          <a href="mailto:${safeEmail}?subject=Re:%20tu%20mensaje%20desde%20cacruz.com"
             style="display:inline-block;margin-top:24px;padding:11px 22px;background:#a78bfa;color:#0a0a0b;font-weight:700;font-size:14px;text-decoration:none;border-radius:999px;">
            Responder a ${safeName} →
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 24px 22px;">
          <p style="margin:0;font-family:ui-monospace,Consolas,monospace;font-size:11px;color:#6f6f77;">
            Enviado desde el formulario de contacto de cacruz.com
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
