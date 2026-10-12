export const T = {
  fa: {
    brand: '{{CLINIC_NAME}}', title: 'دندان را از درون ببینید',
    lead: 'مدل سه‌بعدی تعاملی: بچرخانید، روی هر بخش بزنید، و اجزای ایمپلنت را از هم باز کنید.',
    tooth: 'آناتومی دندان', implant: 'ایمپلنت', explode: 'نمای انفجاری', assemble: 'جمع کردن', reset: 'بازنشانی دوربین',
    pick: 'روی یکی از بخش‌های مدل بزنید.', notice: 'مدل سه‌بعدی نمایشی است و تشخیص پزشکی نیست.',
    emergency: 'درد شدید، تورم یا خونریزی: با کلینیک یا اورژانس تماس بگیرید.',
    servicesH: 'خدمات', book: 'رزرو نوبت', name: 'نام', phone: 'موبایل (۰۹…)', service: 'دلیل مراجعه', msg: 'پیام شما (اختیاری)', msgP: 'هر چیزی که مایلید بدانیم؟', date: 'تاریخ', time: 'ساعت',
    consent: 'با ثبت نام، شماره و زمان برای هماهنگی نوبت موافقم.', send: 'ارسال درخواست',
    ok: 'نوبت ثبت شد. کلینیک برای تأیید تماس می‌گیرد.', fail: 'خطا در ثبت. فیلدهای قرمز را بررسی کنید.', from: 'شروع از',
    svc: { checkup: 'معاینه و جرم‌گیری', whitening: 'سفیدکردن دندان', implant: 'ایمپلنت', aligner: 'ارتودنسی شفاف', veneer: 'لمینت', emergency: 'اورژانس دندان' },
    loading: 'در حال بارگذاری مدل…', scroll: 'برای باز شدن اجزا، اسکرول کنید',
  },
  en: {
    brand: '{{CLINIC_NAME}}', title: 'See the tooth from the inside',
    lead: 'An interactive 3D model: rotate it, tap any part, and pull the implant apart.',
    tooth: 'Tooth anatomy', implant: 'Dental implant', explode: 'Exploded view', assemble: 'Assemble', reset: 'Reset camera',
    pick: 'Tap a part of the model.', notice: 'Illustrative 3D model, not a medical diagnosis.',
    emergency: 'Severe pain, swelling or bleeding: call the clinic or emergency services.',
    servicesH: 'Services', book: 'Book an appointment', name: 'Name', phone: 'Mobile (09…)', service: 'Reason for visit', msg: 'Your message (optional)', msgP: 'Anything you would like us to know?', date: 'Date', time: 'Time',
    consent: 'I agree to share my name, phone and time to arrange the visit.', send: 'Send request',
    ok: 'Request sent. The clinic will call to confirm.', fail: 'Could not send. Check the highlighted fields.', from: 'Starting from',
    svc: { checkup: 'Check-up & cleaning', whitening: 'Teeth whitening', implant: 'Dental implant', aligner: 'Clear aligners', veneer: 'Veneers', emergency: 'Dental emergency' },
    loading: 'Loading model…', scroll: 'Scroll to open the tooth',
  },
};
export const SERVICES = ['checkup', 'whitening', 'implant', 'aligner', 'veneer', 'emergency'];
export const TIMES = ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00'];
export const INFO = {
  tooth: {
    enamel: { fa: ['مینا', 'سخت‌ترین بافت بدن؛ لایه‌ی بیرونی که از عاج محافظت می‌کند.'], en: ['Enamel', 'The hardest tissue in the body; the outer shell that protects the dentin.'] },
    dentin: { fa: ['عاج', 'لایه‌ی زیر مینا؛ زرد‌تر و نرم‌تر است و محیط پالپ را می‌پوشاند.'], en: ['Dentin', 'The layer under the enamel; softer and yellower, it surrounds the pulp.'] },
    pulp: { fa: ['پالپ', 'مرکز دندان با عروق و عصب.'], en: ['Pulp', 'The centre of the tooth, with blood vessels and nerves.'] },
    root: { fa: ['ریشه', 'دندان را در استخوان فک نگه می‌دارد.'], en: ['Root', 'Anchors the tooth in the jawbone.'] },
    gum: { fa: ['لثه', 'بافت نرمی که دور گردن دندان را می‌گیرد.'], en: ['Gum', 'Soft tissue that seals around the neck of the tooth.'] },
    bone: { fa: ['استخوان فک', 'پایه‌ی دندان‌ها؛ ایمپلنت با آن جوش می‌خورد.'], en: ['Jawbone', 'The foundation of the teeth; an implant fuses with it.'] },
  },
  implant: {
    crown: { fa: ['روکش', 'بخش قابل‌مشاهده که شکل دندان را می‌سازد.'], en: ['Crown', 'The visible part that recreates the tooth.'] },
    abutment: { fa: ['اباتمنت', 'رابط بین روکش و پیچ ایمپلنت.'], en: ['Abutment', 'The connector between crown and fixture.'] },
    screw: { fa: ['فیکسچر (پیچ)', 'جایگزین ریشه؛ داخل استخوان قرار می‌گیرد.'], en: ['Fixture (screw)', 'Replaces the root; sits inside the bone.'] },
    bone: { fa: ['استخوان فک', 'پس از کاشت، با فیکسچر جوش می‌خورد.'], en: ['Jawbone', 'Bonds with the fixture after placement.'] },
  },
};
