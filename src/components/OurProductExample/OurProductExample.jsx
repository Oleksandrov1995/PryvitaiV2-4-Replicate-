import React from 'react';
import './OurProductExample.css';
import { ourProductExamples, categoryColors } from '../../data/ourProductExampleData';
const OurProductExample = () => {

  const getCategoryColor = (category) => {
    return categoryColors[category] || '#8B5CF6';
  };

  return (
    <section className="our-product-example">
      <div className="container">
        <h2 className="section-title">
          Створювати персоналізовані листівки ще ніколи не було так просто та доступно
        </h2>
        
        <div className="examples-grid">
          {ourProductExamples.map((example) => (
            <div key={example.id} className="example-card">
              <div className="card-images">
                <div className="original-image-container">
                  <div className="original-image">
                    <img src={example.originalImage} alt="Оригінальне фото" />
                  </div>
                  <div className="category-tags left-tags">
                    <div 
                      className="category-tag"
                      style={{ backgroundColor: getCategoryColor(example.category) }}
                    >
                      {example.category}
                    </div>
                    <div 
                      className="subcategory-tag"
                      style={{ backgroundColor: getCategoryColor(example.subcategory) }}
                    >
                      {example.subcategory}
                    </div>
                  </div>
                </div>
                <div className="stylized-image">
                  <img src={example.stylizedImage} alt={example.category} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurProductExample;
