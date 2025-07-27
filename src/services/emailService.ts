import { httpsCallable } from "firebase/functions"
import { functions } from "../firebase/config"

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

interface WelcomeEmailData {
  email: string
  displayName: string
}

interface LoginAlertData {
  device: string
  location: string
  time: string
}

interface OrderConfirmationData {
  orderId: string
  items: any[]
  total: number
  customerName: string
}

// Cloud Functions for sending emails
const sendEmailFunction = httpsCallable(functions, "sendEmail")
const sendWelcomeEmailFunction = httpsCallable(functions, "sendWelcomeEmail")
const sendOrderConfirmationFunction = httpsCallable(functions, "sendOrderConfirmation")
const sendLoginAlertFunction = httpsCallable(functions, "sendLoginAlert")

export const sendEmail = async (emailData: EmailData) => {
  try {
    const result = await sendEmailFunction(emailData)
    return result.data
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error("فشل في إرسال البريد الإلكتروني")
  }
}

export const sendWelcomeEmail = async (email: string, displayName: string) => {
  try {
    const result = await sendWelcomeEmailFunction({ email, displayName })
    return result.data
  } catch (error) {
    console.error("Error sending welcome email:", error)
    // Don't throw error for welcome email to avoid blocking registration
  }
}

export const sendOrderConfirmation = async (email: string, orderData: OrderConfirmationData) => {
  try {
    const result = await sendOrderConfirmationFunction({ email, ...orderData })
    return result.data
  } catch (error) {
    console.error("Error sending order confirmation:", error)
    // Don't throw error to avoid blocking order completion
  }
}

export const sendLoginAlert = async (email: string, alertData: LoginAlertData) => {
  try {
    const result = await sendLoginAlertFunction({ email, ...alertData })
    return result.data
  } catch (error) {
    console.error("Error sending login alert:", error)
    // Don't throw error for security alerts
  }
}

export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  const emailData: EmailData = {
    to: email,
    subject: "إعادة تعيين كلمة المرور - GameZone",
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">GameZone</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">إعادة تعيين كلمة المرور</h2>
          <p style="color: #666; line-height: 1.6;">
            تم طلب إعادة تعيين كلمة المرور لحسابك. اضغط على الرابط أدناه لإعادة تعيين كلمة المرور:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              إعادة تعيين كلمة المرور
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p>© 2024 GameZone. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    `,
    text: `إعادة تعيين كلمة المرور - GameZone\n\nتم طلب إعادة تعيين كلمة المرور لحسابك.\n\nاضغط على الرابط التالي: ${resetLink}\n\nإذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.`,
  }

  return sendEmail(emailData)
}

export const sendAccountVerificationEmail = async (email: string, verificationLink: string) => {
  const emailData: EmailData = {
    to: email,
    subject: "تأكيد البريد الإلكتروني - GameZone",
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">GameZone</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">مرحباً بك في GameZone!</h2>
          <p style="color: #666; line-height: 1.6;">
            شكراً لك على التسجيل في GameZone. لإكمال عملية التسجيل، يرجى تأكيد بريدك الإلكتروني بالضغط على الرابط أدناه:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              تأكيد البريد الإلكتروني
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            إذا لم تقم بالتسجيل في GameZone، يمكنك تجاهل هذا البريد الإلكتروني.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p>© 2024 GameZone. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    `,
    text: `مرحباً بك في GameZone!\n\nشكراً لك على التسجيل. لإكمال عملية التسجيل، يرجى تأكيد بريدك الإلكتروني:\n\n${verificationLink}\n\nإذا لم تقم بالتسجيل، يمكنك تجاهل هذا البريد الإلكتروني.`,
  }

  return sendEmail(emailData)
}

export const sendPromotionalEmail = async (email: string, promotion: any) => {
  const emailData: EmailData = {
    to: email,
    subject: `عرض خاص من GameZone - ${promotion.title}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">GameZone</h1>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">${promotion.title}</h2>
          <p style="color: #666; line-height: 1.6;">
            ${promotion.description}
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${promotion.link}" style="background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              استفد من العرض الآن
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            العرض ساري حتى ${promotion.expiryDate}
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p>© 2024 GameZone. جميع الحقوق محفوظة.</p>
          <p style="font-size: 12px; margin-top: 10px;">
            <a href="#" style="color: #ccc;">إلغاء الاشتراك</a>
          </p>
        </div>
      </div>
    `,
    text: `${promotion.title}\n\n${promotion.description}\n\nاستفد من العرض: ${promotion.link}\n\nالعرض ساري حتى ${promotion.expiryDate}`,
  }

  return sendEmail(emailData)
}
