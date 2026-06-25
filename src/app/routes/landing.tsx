import { useNavigate } from 'react-router';


// import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';
import { Navbar } from '@/components/landing/navbar';
import { Hero, HowItWorks, Features, Compliance, Testimonials, FinalCTA, Footer } from '@/components/landing';

const LandingRoute = () => {
//   const navigate = useNavigate();
//   const user = useUser();

//   const handleStart = () => {
//     if (user.data) {
//       navigate(paths.app.dashboard.getHref());
//     } else {
//       navigate(paths.auth.login.getHref());
//     }
//   };

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Compliance />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
};

export default LandingRoute;