import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Contact() {
  return (
    <div className="section-padding py-16 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Get in <span className="gradient-text">Touch</span></h1>
        <p className="text-muted text-lg">Have questions? We'd love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <h2 className="text-lg font-bold mb-6">Send us a message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input label="Name" placeholder="Your name" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark/80">Message</label>
              <textarea rows={4} placeholder="Type your message..." className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-white text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none" />
            </div>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </Card>

        <div className="space-y-6">
          {[
            { icon: '📍', label: 'Office', value: 'Pune, Maharashtra, India' },
            { icon: '📧', label: 'Email', value: 'support@appointy.com' },
            { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
            { icon: '🕐', label: 'Hours', value: 'Monday – Saturday, 9am – 7pm' },
          ].map(({ icon, label, value }) => (
            <Card key={label} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
              <div>
                <p className="text-sm text-muted">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
