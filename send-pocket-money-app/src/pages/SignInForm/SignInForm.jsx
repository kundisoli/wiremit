import React, { useState } from "react";
import { AiOutlineMail, AiOutlineLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaFacebook, FaYoutube, FaGoogle, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import signinImage from "../../assets/Login.jpg";
import "./SigninForm.scss";

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="signin-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="signin-left"
        variants={imageVariants}
      >
        <motion.img 
          src={signinImage} 
          alt="Signin visual" 
          className="signin-image"
          whileHover={{ scale: 1.02 }}
        />
      </motion.div>
      
      <div className="signin-right">
        <motion.div className="signin-content" variants={containerVariants}>
          <motion.h1 variants={itemVariants}>Welcome back!</motion.h1>
          <motion.p className="subtitle" variants={itemVariants}>
            Your gateway to sending money abroad safely and effortlessly. Let’s continue where you left off
          </motion.p>
          
          <motion.form 
            onSubmit={handleSubmit} 
            className="signin-form"
            variants={containerVariants}
          >
            <motion.div className="input-group" variants={itemVariants}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div className="input-group password-field" variants={itemVariants}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </motion.div>

            <div className="remember-forgot">
              <motion.div className="remember-me" variants={itemVariants}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </motion.div>
              <motion.a href="/forgot-password" className="forgot-password" variants={itemVariants}>
                Forgot password?
              </motion.a>
            </div>

            <motion.button 
              type="submit" 
              className="signin-btn"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              SIGN IN
            </motion.button>
          </motion.form>

          <motion.div className="divider" variants={itemVariants}>---</motion.div>

          <motion.div className="social-login" variants={itemVariants}>
            <p>Or Sign in with social platforms</p>
            <motion.div 
              className="social-icons"
              variants={containerVariants}
            >
              <motion.span 
                className="icon" 
                variants={itemVariants}
                whileHover={{ y: -3, scale: 1.1 }}
              >
                <FaFacebook />
              </motion.span>
              <motion.span 
                className="icon" 
                variants={itemVariants}
                whileHover={{ y: -3, scale: 1.1 }}
              >
                <FaYoutube />
              </motion.span>
              <motion.span 
                className="icon" 
                variants={itemVariants}
                whileHover={{ y: -3, scale: 1.1 }}
              >
                <FaGoogle />
              </motion.span>
              <motion.span 
                className="icon" 
                variants={itemVariants}
                whileHover={{ y: -3, scale: 1.1 }}
              >
                <FaLinkedin />
              </motion.span>
            </motion.div>
          </motion.div>

          <motion.p className="signup-link" variants={itemVariants}>
            Don't have an account? <a href="/signup">Sign up</a>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignInForm;