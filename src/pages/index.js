import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactStars from 'react-stars'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

import IdentityModal, {
  useIdentityContext,
} from 'react-netlify-identity-widget'
import 'react-netlify-identity-widget/styles.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default () => {
  // app
  const [status, setStatus] = useState('loading')

  // avatar
  const getAvatar = id => {
    return `https://avatars.dicebear.com/api/human/${id}.svg?mood[]=happy`
  }

  // identity
  const [dialog, setDialog] = useState(false)
  const identity = useIdentityContext()
  const isLoggedIn = identity && identity.isLoggedIn
  const name =
    (identity &&
      identity.user &&
      identity.user.user_metadata &&
      identity.user.user_metadata.full_name) ||
    'Untitled'

  // testimonial
  const [rating, setRating] = useState(4)
  const [show, setShow] = useState(false)
  const [text, setText] = useState('')
  const [testimonials, setTestimonials] = useState(null)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleCreate = async event => {
    if (text === '') {
      return
    }

    await axios.post('/api/create-testimonial', { text, rating })
    const newList = testimonials.concat({ text, rating })

    setTestimonials(newList)
    setShow(false)
  }

  const ratingChanged = newRating => setRating(newRating)
  const textChanged = evt => {
    const val = evt.target.value
    setText(val)
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
    <>
      <div className="auth-btn-grp">
        {isLoggedIn ? (
          <>
            <Button
              variant="outline-primary"
              onClick={handleShow}
              style={{ marginRight: '1rem' }}
            >
              Create Testimonial
            </Button>
            <Button
              variant="outline-primary"
              className="login-btn"
              onClick={() => setDialog(true)}
            >
              Log Out, {name}
            </Button>
          </>
        ) : (
          <Button
            variant="outline-primary"
            className="login-btn"
            onClick={() => setDialog(true)}
          >
            Log In
          </Button>
        )}
      </div>

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

      <IdentityModal
        showDialog={dialog}
        onCloseDialog={() => setDialog(false)}
      />

      <Modal
        className="create-testimonial"
        onHide={handleClose}
        animation={true}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create a Testimonial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="create-form">
            <textarea
              onChange={evt => textChanged(evt)}
              placeholder="Enter your message here"
            />
            <br />
            <span>Rating:</span>{' '}
            <ReactStars
              count={5}
              value={rating}
              onChange={ratingChanged}
              size={24}
              color2={'#ffd700'}
              half={false}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={evt => handleCreate(evt)}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
