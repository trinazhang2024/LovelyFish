import React from "react";
import SEO from '../../../components/SEO'
import './FishCareFAQ.css';

function FishCareFAQ() {
  return (
    <>
      <SEO
        title="Fish Care FAQ | Lovely Fish Aquarium"
        description="Frequently asked questions about fish care including diseases, feeding tips, aquarium maintenance, and water quality."
      />

      <div className="fish-care-faq">
        <h1>📋 Aquarium Fish Care FAQ</h1>

        <section>
          <h2>Common Aquarium Fish Problems</h2>
          <p>
            Aquarium fish may experience problems such as stress, diseases,
            poor water quality, or compatibility issues with other fish.
            Understanding these common fish problems helps aquarium owners
            maintain a healthier fish tank environment.
          </p>
        </section>

        <section>
          <h2>How to Keep Aquarium Fish Healthy</h2>
          <p>
            To keep aquarium fish healthy, maintain stable water quality,
            provide proper filtration, and avoid overstocking your tank.
            Regular water changes and monitoring temperature are essential
            for long-term fish health.
          </p>
        </section>

        <section>
          <h2>Fish Feeding Tips</h2>
          <p>
            Feed aquarium fish small portions once or twice a day.
            Overfeeding can lead to poor water quality and algae growth.
            Choose high-quality fish food that matches the species you keep.
          </p>
        </section>

        <section>
          <h2>Water Quality and Tank Setup</h2>
          <p>
            Good water quality is the foundation of a healthy aquarium.
            Use proper filtration, test water parameters regularly, and
            perform partial water changes to maintain a stable environment
            for your fish.
          </p>
        </section>
      </div>
    </>
  );
}

export default FishCareFAQ;


// Google can recognize these keywords easily：

// fish care

// aquarium fish

// fish diseases

// water quality

// fish tank setup
