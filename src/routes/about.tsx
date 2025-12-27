import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, MapPin, Phone, Download, Code, Palette, Server, Smartphone, Cloud } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-chart-3/10 border-b">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                <img 
                  src="/taia.png" 
                  alt="Taia Tiniyara" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
              Hi, I'm <span className="text-primary">Taia Tiniyara</span>
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-muted-foreground">
              Software Engineer
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <span>Lami, Fiji</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-primary" />
                <a href="tel:+6799860831" className="hover:text-primary transition-colors">+679 986 0831</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-primary" />
                <a href="mailto:mail@taiatiniyara.com" className="hover:text-primary transition-colors">mail@taiatiniyara.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
        {/* Professional Summary */}
        <section className="mb-12 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">About Me</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
              I'm a passionate software engineer with a unique blend of graphic design and software development expertise. 
              With over 7 years of professional experience, I specialize in building robust, scalable solutions for web, 
              mobile, and desktop platforms.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              My journey has taken me from graphic and web design to developing enterprise-level systems for Pacific 
              utilities, combining technical excellence with creative problem-solving to deliver solutions that make 
              a real impact. I specialize in GIS-based applications, cloud infrastructure, and modern backend as a service platforms.
            </p>
          </Card>
        </section>

        {/* Technical Skills */}
        <section className="mb-12 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Technical Expertise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-3">Programming</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• JavaScript / TypeScript</li>
                <li>• Python / Golang</li>
                <li>• C# / Kotlin / Dart</li>
              </ul>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-chart-3/10 flex items-center justify-center mb-4">
                <Server className="w-6 h-6 text-chart-3" />
              </div>
              <h3 className="font-bold text-lg mb-3">Frameworks</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• React JS / Next JS</li>
                <li>• ASP.NET Core</li>
                <li>• Node.js / Express</li>
              </ul>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-chart-2/10 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-chart-2" />
              </div>
              <h3 className="font-bold text-lg mb-3">Databases & BaaS</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• MySQL / PostgreSQL</li>
                <li>• Firebase / Supabase</li>
                <li>• MongoDB</li>
              </ul>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-chart-5/10 flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6 text-chart-5" />
              </div>
              <h3 className="font-bold text-lg mb-3">Cloud & GIS</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Google Cloud Platform</li>
                <li>• AWS</li>
                <li>• GIS Applications</li>
              </ul>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-chart-4/10 flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-chart-4" />
              </div>
              <h3 className="font-bold text-lg mb-3">Design</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Adobe XD / Figma</li>
                <li>• Photoshop / Illustrator</li>
                <li>• UI/UX Design</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-12 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Professional Experience</h2>
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 shadow-lg border-l-4 border-l-primary">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary">Software Engineer</h3>
                  <p className="text-muted-foreground">Self-Employed</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={16} />
                  <span>Sep 2021 - Present</span>
                </div>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Developed a multi-tenant GIS-based electricity meter reading and billing system for Innov8 Pacific, targeting South Pacific utilities</li>
                <li>• Built a performance benchmarking system for Pacific Island energy companies (Pacific Power Association members)</li>
                <li>• Collaborated with senior engineers on enterprise-level solutions using modern tech stacks</li>
                <li>• Deployed applications on Google Cloud Platform and AWS</li>
              </ul>
            </Card>

            <Card className="p-6 sm:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold">Graphic & Web Designer</h3>
                  <p className="text-muted-foreground">Peniel Layman's Ministry, Fiji</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={16} />
                  <span>Jan 2016 - Nov 2019</span>
                </div>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Created compelling visual designs and web solutions for ministry communications</li>
                <li>• Developed brand identity and marketing materials</li>
                <li>• Built and maintained web presence using modern web technologies</li>
              </ul>
            </Card>

            <Card className="p-6 sm:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold">Medical Missionary Training</h3>
                  <p className="text-muted-foreground">Three Angels Missionary College & Health Retreat</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={16} />
                  <span>2020</span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Completed comprehensive medical missionary course and practical training at Nacilau, Rakiraki, Fiji
              </p>
            </Card>
          </div>
        </section>

        {/* Education */}
        <section className="mb-12 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Education</h2>
          <Card className="p-6 sm:p-8 shadow-lg">
            <h3 className="text-xl font-bold mb-2">Bachelor of Commerce</h3>
            <p className="text-muted-foreground mb-2">University of the South Pacific</p>
            <p className="text-sm text-muted-foreground mb-3">Majors: Information Systems & Management, Public Administration</p>
            <p className="text-sm">2012 - 60% Completed</p>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="p-8 sm:p-12 shadow-xl bg-linear-to-br from-primary/5 to-chart-3/5">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
              Interested in collaborating or learning more about my work? Download my full CV or get in touch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="/CV.pdf" download className="flex items-center gap-2">
                  <Download size={20} />
                  Download Full CV
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <a href="mailto:mail@taiatiniyara.com">
                  Get In Touch
                </a>
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
