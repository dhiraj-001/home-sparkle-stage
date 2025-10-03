import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  review: string;
  image: string;
  image_full_path: string;
  created_at: string;
  updated_at: string;
}

interface TestimonialResponse {
  response_code: string;
  message: string;
  content: {
    testimonial: Testimonial[];
  };
}

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
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

      const data: TestimonialResponse = await response.json();
      
      if (data.response_code === 'default_200' && data.content.testimonial) {
        setTestimonials(data.content.testimonial);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center">Loading testimonials...</div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const testimonial = testimonials[currentTestimonial];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied customers
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Customer Image */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                <img
                  src={testimonial.image_full_path}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="flex-1 text-center md:text-left">
              <Quote className="w-8 h-8 text-blue-500 mb-4 mx-auto md:mx-0" />
              
              <blockquote className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                "{testimonial.review}"
              </blockquote>

              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-lg">
                  {testimonial.name}
                </h4>
                <p className="text-blue-600 font-medium">
                  {testimonial.designation}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;