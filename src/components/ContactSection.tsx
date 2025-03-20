
import React from 'react';
import Button from './Button';
import AnimatedText from './AnimatedText';
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl" />
      </div>

      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
              Contact Us
            </span>
          </div>
          
          <AnimatedText 
            text="Get in touch with our team"
            tag="h2"
            className="text-3xl md:text-4xl font-semibold mb-5 tracking-tight text-balance"
            animation="slide-up"
            delay={100}
          />
          
          <AnimatedText
            text="We're here to help and answer any questions you might have. We look forward to hearing from you."
            tag="p"
            className="text-muted-foreground text-lg leading-relaxed"
            animation="slide-up"
            delay={200}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div 
            className="bg-white rounded-xl p-8 glass shadow-subtle"
            style={{ 
              opacity: 0,
              transform: 'translateY(20px)',
              animation: 'slide-up 0.6s ease-out forwards',
              animationDelay: '300ms'
            }}
          >
            <form>
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Your message"
                  required
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full" size="lg">
                Send Message
              </Button>
            </form>
          </div>
          
          <div 
            className="flex flex-col justify-center"
            style={{ 
              opacity: 0,
              transform: 'translateY(20px)',
              animation: 'slide-up 0.6s ease-out forwards',
              animationDelay: '500ms'
            }}
          >
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">Get In Touch</h3>
              <p className="text-muted-foreground mb-8">
                Have a specific question or inquiry? Our team is ready to provide the information you need.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Mail size={20} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Email</h4>
                    <p className="text-muted-foreground">contact@example.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Phone size={20} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin size={20} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Location</h4>
                    <p className="text-muted-foreground">San Francisco, CA 94103, USA</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
              <p className="text-muted-foreground mb-4">We're available during the following hours:</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
