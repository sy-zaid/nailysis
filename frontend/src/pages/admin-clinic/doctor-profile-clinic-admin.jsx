import styles from "./doctor-profile-clinic-admin.module.css";

const DoctorProfile = () => {
  return (
    <div className={styles.container}>
      {/* Doctor Header */}
      <div className={styles.header}>
        <img src="/doctor.png" alt="Doctor" className={styles.doctorImage} />
        <div className={styles.headerInfo}>
          <h1>Dr. John Doe</h1>
          <p>Consultant at XYZ Hospital</p>
          <p>North Nazimabad, Karachi</p>
          <div className={styles.buttons}>
            <button className={styles.contactBtn}>Contact Doctor</button>
            <button className={styles.appointmentBtn}>Book Appointment</button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className={styles.about}>
        <h2>About</h2>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat
          doloribus debitis explicabo, accusantium beatae perferendis maxime eos
          officia consequatur sunt quia aperiam laborum voluptate, qui expedita,
          culpa perspiciatis. Assumenda, maiores.
        </p>
      </div>

      {/* My Story */}
      <div className={styles.section}>
        <h3>My Story</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
          provident incidunt perferendis expedita, illum deleniti rem laboriosam
          mollitia deserunt, culpa ipsam ipsum vel ipsa minima saepe praesentium
          animi quam numquam.
        </p>
      </div>

      {/* Why Choose John Doe */}
      <div className={styles.section}>
        <h3>Why Choose John Doe?</h3>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius
          repellendus cumque quidem vero animi amet excepturi perspiciatis dolor
          possimus fugit! Magni iusto, impedit debitis culpa perferendis tenetur
          ab quam facere.
        </p>
      </div>

      {/* Social Media */}
      <div className={styles.socialMedia}>
        <h2>Social Media</h2>
        <div className={styles.icons}>
          <img src="/gmail.png" alt="Gmail" />
          <img src="/fb.png" alt="Facebook" />
          <img src="/whatsapp.png" alt="WhatsApp" />
          <img src="/behance.png" alt="Behance" />
          <img src="/linkedin.png" alt="LinkedIn" />
          <img src="/insta.png" alt="Instagram" />
        </div>
      </div>

      {/* Photo Gallery */}
      <div className={styles.photoGallery}>
        <h2>Photo Gallery</h2>
        <div className={styles.gallery}>
          <img src="/show1.png" alt="Gallery 1" />
          <img src="/show2.png" alt="Gallery 2" />
          <img src="/show3.png" alt="Gallery 3" />
        </div>
      </div>

      {/* Links */}
      <div className={styles.links}>
        <h2>Links</h2>
        <p>The Importance of Scheduling Early</p>
        <p>The Importance of Scheduling Early</p>
      </div>

      {/* Contact Info */}
      <div className={styles.contactInfo}>
        <h2>Contact Info</h2>
        <div className={styles.contactItems}>
          <p>Phone: +10 123456789</p>
          <p>Email: johndoeemail@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
