import type React from "react"
import Link from "next/link"
import { Gamepad2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <Gamepad2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">GameZone</span>
            </div>
            <p className="text-gray-400 mb-4">
              منصتك الموثوقة لشحن الألعاب وشراء الحسابات المميزة. نوفر أفضل الأسعار وأسرع الخدمات.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/recharge" className="text-gray-400 hover:text-white transition-colors">
                  شحن الألعاب
                </Link>
              </li>
              <li>
                <Link href="/buy-accounts" className="text-gray-400 hover:text-white transition-colors">
                  شراء حسابات
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Games */}
          <div>
            <h3 className="text-lg font-semibold mb-4">الألعاب المدعومة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/games/fifa" className="text-gray-400 hover:text-white transition-colors">
                  FIFA Mobile
                </Link>
              </li>
              <li>
                <Link href="/games/pubg" className="text-gray-400 hover:text-white transition-colors">
                  PUBG Mobile
                </Link>
              </li>
              <li>
                <Link href="/games/free-fire" className="text-gray-400 hover:text-white transition-colors">
                  Free Fire
                </Link>
              </li>
              <li>
                <Link href="/games/cod" className="text-gray-400 hover:text-white transition-colors">
                  Call of Duty
                </Link>
              </li>
              <li>
                <Link href="/games/pes" className="text-gray-400 hover:text-white transition-colors">
                  PES Mobile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="h-5 w-5 text-blue-500" />
                <span className="text-gray-400">support@gamezone.com</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="h-5 w-5 text-blue-500" />
                <span className="text-gray-400">+20 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <MapPin className="h-5 w-5 text-blue-500" />
                <span className="text-gray-400">القاهرة، مصر</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">طرق الدفع المقبولة</h4>
              <div className="flex space-x-2 space-x-reverse">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs text-gray-900 font-semibold">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs text-gray-900 font-semibold">فودافون كاش</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs text-gray-900 font-semibold">فوري</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 GameZone. جميع الحقوق محفوظة.</p>
            <div className="flex space-x-6 space-x-reverse mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                شروط الاستخدام
              </Link>
              <Link href="/refund" className="text-gray-400 hover:text-white text-sm transition-colors">
                سياسة الاسترداد
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
