// Configuração do EmailJS (envio de e-mail client-side).
// Os valores vêm de variáveis de ambiente Vite (prefixo VITE_). Veja .env.example.
export const emailJsConfig = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "",
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "",
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "",
};

export function isEmailJsConfigured(): boolean {
    return Boolean(
        emailJsConfig.serviceId &&
        emailJsConfig.templateId &&
        emailJsConfig.publicKey
    );
}
