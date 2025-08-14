import React, { useState } from "react";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaFacebook, FaYoutube, FaGoogle, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import signupImage from "../../assets/Login.jpg"; 
import "./Signup.scss";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
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
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="signup-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="signup-left">
        <motion.div className="signup-content" variants={containerVariants}>
          <motion.h1 variants={itemVariants}>New here?</motion.h1>
          <motion.p className="subtitle" variants={itemVariants}>

Send money to your loved ones abroad quickly, safely, and effortlessly. Create your account today and stay connected across borders
          </motion.p>
          
          <motion.form 
            onSubmit={handleSubmit} 
            className="signup-form"
            variants={containerVariants}
          >
            <motion.div className="input-group" variants={itemVariants}>
              <input
                type="text"
                name="name"
                placeholder="Username"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </motion.div>

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

            <motion.div className="input-group password-field" variants={itemVariants}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </motion.div>

            <motion.button 
              type="submit" 
              className="signup-btn"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              SIGN UP
            </motion.button>
          </motion.form>

          <motion.div className="divider" variants={itemVariants}>---</motion.div>

          <motion.div className="social-login" variants={itemVariants}>
            <p>Or Sign up with social platforms</p>
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
        </motion.div>
      </div>
      
      <motion.div 
        className="signup-right"
        variants={imageVariants}
      >
        <motion.img 
          src={signupImage} 
          alt="Signup visual" 
          className="signup-image"
          whileHover={{ scale: 1.02 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SignupForm;