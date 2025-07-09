import { Facebook, Instagram, MessageCircle, Youtube } from "lucide-react";
const Footer = () => {
  const socialLinks = [{
    name: "WhatsApp",
    icon: MessageCircle,
    url: "https://example.com/whatsapp",
    className: "hover:text-green-500"
  }, {
    name: "Instagram",
    icon: Instagram,
    url: "https://example.com/instagram",
    className: "hover:text-pink-500"
  }, {
    name: "Facebook",
    icon: Facebook,
    url: "https://example.com/facebook",
    className: "hover:text-blue-500"
  }, {
    name: "YouTube",
    icon: Youtube,
    url: "https://example.com/youtube",
    className: "hover:text-red-500"
  }];
  return <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo/Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-primary">MyR</h3>
            <p className="text-sm text-muted-foreground">
              Tu tienda de confianza en Peñaflor
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-6">
            {socialLinks.map(social => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className={`text-muted-foreground transition-colors duration-200 ${social.className}`} aria-label={social.name}>
                <social.icon className="h-6 w-6" />
              </a>)}
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              📍 Peñaflor, cerca de la plaza
            </p>
            <p className="text-sm text-muted-foreground">📞 +56 9 3083 7263</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 MyR. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;