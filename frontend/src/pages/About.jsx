import Card from '../components/ui/Card';

const team = [
  { name: 'Dr. Aarav Sharma', role: 'Chief Medical Officer', emoji: '🩺' },
  { name: 'Priya Kapoor', role: 'Head of Operations', emoji: '📋' },
  { name: 'Rahul Mehta', role: 'Lead Engineer', emoji: '💻' },
];

export default function About() {
  return (
    <div className="section-padding py-16 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold mb-4">About <span className="gradient-text">Appointy</span></h1>
        <p className="text-muted text-lg leading-relaxed">
          We're on a mission to make quality healthcare accessible to everyone.
          Appointy connects patients with trusted doctors through a seamless digital experience.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
        <Card>
          <h2 className="text-xl font-bold mb-3">Our Mission</h2>
          <p className="text-muted leading-relaxed">
            To remove barriers to healthcare access by providing an intuitive, reliable platform
            that connects patients with the right doctor at the right time — eliminating long waits,
            confusing processes, and missed appointments.
          </p>
        </Card>
        <Card>
          <h2 className="text-xl font-bold mb-3">Our Vision</h2>
          <p className="text-muted leading-relaxed">
            A world where everyone can access quality healthcare with just a few clicks.
            We envision a future where health management is proactive, personalized, and powered by technology.
          </p>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {team.map(({ name, role, emoji }) => (
            <Card key={name} className="text-center" hover>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center text-3xl mb-4">{emoji}</div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-muted">{role}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
