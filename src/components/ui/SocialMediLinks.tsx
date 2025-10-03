import { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Link2 } from 'lucide-react';

interface SocialMedia {
  id: string;
  media: string;
  link: string;
  status: number;
}

interface SocialMediaResponse {
  response_code: string;
  message: string;
  content: {
    social_media: SocialMedia[];
  };
}

const SocialMediaLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const fetchSocialMedia = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://admin.sarvoclub.com';
      const response = await fetch(
        `${baseUrl}/api/v1/customer/landing/contents?limit=10&offset=1`,
        {
          headers: {
            'Content-Type': 'application/json',
            'zoneId': 'a02c55ff-cb84-4bbb-bf91-5300d1766a29',
            'X-localization': 'en',
            'guest_id': '7e223db0-9f62-11f0-bba0-779e4e64bbc8',
          },
        }
      );

      const data: SocialMediaResponse = await response.json();
      
      if (data.response_code === 'default_200' && data.content.social_media) {
        // Filter only active social media links
        const activeLinks = data.content.social_media.filter(link => link.status === 1);
        setSocialLinks(activeLinks);
      }
    } catch (error) {
      console.error('Error fetching social media:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (media: string) => {
    switch (media.toLowerCase()) {
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      default:
        return <Link2 className="w-5 h-5" />;
    }
  };

  const getSocialColor = (media: string) => {
    switch (media.toLowerCase()) {
      case 'facebook':
        return 'hover:bg-blue-600 hover:border-blue-600';
      case 'instagram':
        return 'hover:bg-pink-600 hover:border-pink-600';
      case 'linkedin':
        return 'hover:bg-blue-700 hover:border-blue-700';
      case 'youtube':
        return 'hover:bg-red-600 hover:border-red-600';
      default:
        return 'hover:bg-gray-600 hover:border-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center gap-4 py-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center py-12 bg-gray-50 rounded-2xl">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Follow Us On Social Media
      </h3>
      
      <div className="flex gap-4 flex-wrap justify-center">
        {socialLinks.map((social) => (
          <a
            key={social.id}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              w-12 h-12 rounded-full border-2 border-gray-300 
              flex items-center justify-center 
              text-gray-600 hover:text-white 
              transition-all duration-300 transform hover:scale-110
              ${getSocialColor(social.media)}
            `}
            title={`Follow us on ${social.media}`}
          >
            {getSocialIcon(social.media)}
          </a>
        ))}
      </div>
      
      <p className="text-gray-600 text-sm mt-4 text-center">
        Stay updated with our latest services and offers
      </p>
    </div>
  );
};

export default SocialMediaLinks;