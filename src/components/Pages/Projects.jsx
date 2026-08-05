import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from 'react-icons/fa';

const Projects = () => {
  const { data } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  if (!data || !data.projects || data.projects.length === 0) {
    return <div className="section">Loading...</div>;
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
    e.stopPropagation();
    if (images.length > 0) {
      setImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (images.length > 0) {
      setImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // إغلاق الـ Modal عند الضغط على Escape
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  return (
    <section className="section section-alt" id="projects">
      <div className="section-head">
        <p className="section-kicker">Projects</p>
        <h2>Work projects that reflect your actual experience</h2>
      </div>

      <div className="projects-slider-container">
        <button className="slider-btn prev" onClick={prevSlide}>
          <FaChevronLeft />
        </button>

        <div className="project-single-card">
          <article className="panel project-card">
            {/* Image Carousel */}
            <div className="project-image-wrapper">
              {images.length > 0 ? (
                <div className="project-image-carousel">
                  <div 
                    className="project-image" 
                    onClick={() => openModal(images[imageIndex])}
                  >
                    <img src={images[imageIndex]} alt={`${currentProject.title} - ${imageIndex + 1}`} />
                    <div className="image-overlay">
                      <FaExpand className="expand-icon" />
                      <span>Click to expand</span>
                    </div>
                  </div>
                  
                  {/* Image Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button 
                        className="image-nav-btn prev" 
                        onClick={prevImage}
                        aria-label="Previous image"
                      >
                        <FaChevronLeft />
                      </button>
                      <button 
                        className="image-nav-btn next" 
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        <FaChevronRight />
                      </button>
                      <div className="image-dots">
                        {images.map((_, idx) => (
                          <span 
                            key={idx} 
                            className={`dot-image ${idx === imageIndex ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageIndex(idx);
                            }}
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
            <p className="project-summary">{currentProject.summary}</p>
            <ul className="project-details">
              {currentProject.details && currentProject.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
            <div className="tag-row compact">
              {currentProject.tags && currentProject.tags.map((tag) => (
                <span key={tag} className="project-tag">{tag}</span>
              ))}
            </div>
          </article>
        </div>

        <button className="slider-btn next" onClick={nextSlide}>
          <FaChevronRight />
        </button>
      </div>

      {/* Project Counter */}
      <div className="project-counter">
        {currentIndex + 1} / {totalPages}
      </div>

      <div className="slider-dots">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setCurrentIndex(index);
              setImageIndex(0);
            }}
          />
        ))}
      </div>

      {/* Image Modal - Improved */}
      {isModalOpen && (
        <div 
          className="image-modal-overlay" 
          onClick={closeModal}
        >
          <div 
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close-btn" 
              onClick={closeModal}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
            <img 
              src={selectedImage} 
              alt="Project full view" 
              className="modal-image"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;