import React from 'react';

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', marginTop: '2rem', borderTop: '1px solid #eaeaea' }}>
      <p>&copy; {new Date().getFullYear()} Adjudicator&apos;s Utility Tool. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
