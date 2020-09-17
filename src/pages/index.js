import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactStars from 'react-stars'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

export default () => {
  const [status, setStatus] = useState('loading')
  const [testimonials, setTestimonials] = useState(null)

  const getAvatar = id => {
    return `https://avatars.dicebear.com/api/human/${id}.svg?mood[]=happy`
  }

  useEffect(() => {
    if (status !== 'loading') {
      return
    }

    const getTestimonials = async () => {
      const res = await axios('/api/get-testimonials')

      if (res.status !== 200) {
        console.error('Error loading testimonials')
        console.error(res)

        return
      }

      setTestimonials(res.data.messages)
      setStatus('loaded')
    }

    getTestimonials()
  }, [status])

  return (
    <Carousel
      className="main"
      autoPlay={false}
      infiniteLoop={true}
      showStatus={false}
      showThumbs={false}
      showArrows={true}
    >
      {testimonials &&
        testimonials.map((testimonial, index) => {
          return (
            <div key={index}>
              <img
                src={getAvatar(index)}
                alt="avatar"
                height="50px"
                width="50px"
              />
              <div className="testimonial">
                <ReactStars
                  className="rating"
                  color1={'#ffd700'}
                  count={testimonial.rating}
                  edit={false}
                  half={false}
                  size={24}
                />
                <p className="text">{testimonial.text}</p>
              </div>
            </div>
          )
        })}
    </Carousel>
  )
}
