How to Run the App
Prerequisites
Node.js (v14 or higher recommended)

npm or yarn

1. Installation
Clone the repository:

git clone https://github.com/Kundisoli/wiremit.git
cd send-pocket-money-app

2. Install dependencies:
npm install or yarn install

3.Start the development server:
npm run dev
4.Open your browser and navigate to:
http://localhost:5173/


The repository is deployed here are the links for them
https://kundisoli.github.io/wiremit/#/dashboard
https://kundisoli.github.io/wiremit/#/signin
https://kundisoli.github.io/wiremit/#/signup


Interpreting Unclear Requirements
When I was faced with requirements that weren't totally clear, I didn't just sit and wait. Instead, I took the initiative to make some smart, informed assumptions to keep things moving.

For a core feature like the money transfer functionality, for example, I documented my guesses about some of the details we hadn't nailed down yet. I laid out what I thought were reasonable transfer limits (like a minimum of $10 and a maximum of $10,000), which currencies we should support from the start (USD, GBP, and ZAR), and a basic fee structure based on a percentage. This way, we had a solid starting point that we could refine later, and everyone on the team was on the same page.

I also took a "start simple" approach, especially with more complex features like foreign exchange calculations. I built a simple version first and planned to add more complexity as we went along. To avoid overwhelming users with information, I used things like tooltips and simple help text to explain a feature without cluttering the main interface.

I'm a big believer in making the user's life easy, so I focused on setting sensible defaults. I made USD the primary currency and pre-selected bank transfer as the default method in the form. The goal was to guide users smoothly through the process without them having to think too much.

Finally, I always made sure to build in a safety net. For situations where a critical API might be down, I created a robust error handling system. Instead of showing a blank or broken page, the app would fall back to a mock data system that looked and felt like the real thing, ensuring the user experience remained as seamless as possible.

Component Structure & Data Flow
To keep the application organized and easy to maintain, I built it with a clear, logical structure. Think of it like a family tree for the code, where each part of the app is a component. Data flows in a very predictable way from the top-level components down to the smaller ones, which makes it much simpler to debug issues and add new features without breaking anything. 

Component 
