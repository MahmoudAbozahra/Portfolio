import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpand
} from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const SERVER_URL = `${API_BASE_URL}`;

const Projects = () => {
  const { data } = useData();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  /*
   * Separate touch refs for:
   * 1) project slider
   * 2) image slider
   *
   * This prevents an image swipe from accidentally changing the project.
   */
  const projectTouchStartX = useRef(null);
  const projectTouchStartY = useRef(null);

  const imageTouchStartX = useRef(null);
  const imageTouchStartY = useRef(null);


  const getImageSrc = (image) => {
    if (!image) return '';

    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('blob:') ||
      image.startsWith('data:')
    ) {
      return image;
    }

    return `${SERVER_URL}${image}`;
  };

  if (!data || !data.projects || data.projects.length === 0) {
    return (
      <section className="section">
        <div className="section-head center">
          <p className="section-kicker">Projects</p>
          <h2>Loading...</h2>
        </div>
      </section>
    );
  }

  const totalPages = data.projects.length;
  const currentProject = data.projects[currentIndex];
  const images = currentProject.images || [];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
    setImageIndex(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    setImageIndex(0);
  };

  const nextImage = (e) => {
    e?.stopPropagation();

    if (images.length > 1) {
      setImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e?.stopPropagation();

    if (images.length > 1) {
      setImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  /* =========================
     PROJECT SWIPE
     ========================= */

  const handleProjectTouchStart = (e) => {
    if (!e.touches?.length) return;

    projectTouchStartX.current = e.touches[0].clientX;
    projectTouchStartY.current = e.touches[0].clientY;
  };

  const handleProjectTouchEnd = (e) => {
    if (
      projectTouchStartX.current === null ||
      projectTouchStartY.current === null ||
      !e.changedTouches?.length
    ) {
      return;
    }

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = projectTouchStartX.current - endX;
    const diffY = projectTouchStartY.current - endY;

    projectTouchStartX.current = null;
    projectTouchStartY.current = null;

    /*
     * Ignore vertical scrolling.
     * Only trigger when the gesture is clearly horizontal.
     */
    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
    const passedThreshold = Math.abs(diffX) >= 55;

    if (!isHorizontalSwipe || !passedThreshold) return;

    if (diffX > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  /* =========================
     IMAGE SWIPE
     ========================= */

  const handleImageTouchStart = (e) => {
    /*
     * Prevent the project slider from receiving this image swipe.
     */
    e.stopPropagation();

    if (!e.touches?.length) return;

    imageTouchStartX.current = e.touches[0].clientX;
    imageTouchStartY.current = e.touches[0].clientY;
  };

  const handleImageTouchEnd = (e) => {
    e.stopPropagation();

    if (
      imageTouchStartX.current === null ||
      imageTouchStartY.current === null ||
      !e.changedTouches?.length
    ) {
      return;
    }

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = imageTouchStartX.current - endX;
    const diffY = imageTouchStartY.current - endY;

    imageTouchStartX.current = null;
    imageTouchStartY.current = null;

    if (images.length <= 1) return;

    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
    const passedThreshold = Math.abs(diffX) >= 35;

    if (!isHorizontalSwipe || !passedThreshold) return;

    if (diffX > 0) {
      setImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
  };

  /*
   * Lock page scrolling while modal is open
   * and restore the previous value afterwards.
   */
  useEffect(() => {
    if (!isModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen]);

  return (
    <section className="section" id="projects">
      <div className="section-head center">
        <h2>Projects</h2>
      </div>

      <div
        className="projects-slider-container"
        onTouchStart={handleProjectTouchStart}
        onTouchEnd={handleProjectTouchEnd}
      >
        <button
          type="button"
          className="slider-btn prev"
          onClick={prevSlide}
          aria-label="Previous project"
        >
          <FaChevronLeft />
        </button>

        <div className="project-single-card">
          <article className="panel project-card">
            <div className="project-image-wrapper">
              {images.length > 0 ? (
                <div
                  className="project-image-carousel"
                  onTouchStart={handleImageTouchStart}
                  onTouchEnd={handleImageTouchEnd}
                >
                  <div
                    className="project-image"
                    onClick={() => openModal(images[imageIndex])}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${currentProject.title} image ${imageIndex + 1}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal(images[imageIndex]);
                      }
                    }}
                  >
                    <img
                      src={getImageSrc(images[imageIndex])}
                      alt={`${currentProject.title} - ${imageIndex + 1}`}
                      draggable="false"
                    />

                    <div className="image-overlay">
                      <FaExpand className="expand-icon" />
                      <span>Click to expand</span>
                    </div>
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="image-nav-btn prev"
                        onClick={prevImage}
                        aria-label="Previous image"
                      >
                        <FaChevronLeft />
                      </button>

                      <button
                        type="button"
                        className="image-nav-btn next"
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        <FaChevronRight />
                      </button>

                      <div className="image-dots" aria-label="Project images">
                        {images.map((_, idx) => (
                          <button
                            type="button"
                            key={idx}
                            className={`dot-image ${idx === imageIndex ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageIndex(idx);
                            }}
                            aria-label={`View image ${idx + 1}`}
                            aria-current={idx === imageIndex ? 'true' : undefined}
                          />
                        ))}
                      </div>

                      <div className="image-counter">
                        {imageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="project-image-placeholder">
                  <span>📷 No images uploaded</span>
                </div>
              )}
            </div>

            <p className="card-label">{currentProject.type}</p>

            <h3>{currentProject.title}</h3>

            <p className="project-summary">
              {currentProject.summary}
            </p>

            {Array.isArray(currentProject.details) &&
              currentProject.details.length > 0 && (
                <ul className="project-details">
                  {currentProject.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}

            {Array.isArray(currentProject.tags) &&
              currentProject.tags.length > 0 && (
                <div className="tag-row compact">
                  {currentProject.tags.map((tag) => (
                    <span key={tag} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
          </article>
        </div>

        <button
          type="button"
          className="slider-btn next"
          onClick={nextSlide}
          aria-label="Next project"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="project-counter">
        {currentIndex + 1} / {totalPages}
      </div>

      {totalPages > 1 && (
        <div className="slider-dots" aria-label="Projects">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              type="button"
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setCurrentIndex(index);
                setImageIndex(0);
              }}
              aria-label={`View project ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}

      {isModalOpen && selectedImage && (
        <div
          className="image-modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Project image preview"
        >
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <img
              src={getImageSrc(selectedImage)}
              alt="Project full view"
              className="modal-image"
              draggable="false"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;