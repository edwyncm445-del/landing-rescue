/* ==========================================================================
   LANDING RESCUE — site configuration
   --------------------------------------------------------------------------
   This is the ONLY file a non-technical owner should need to edit.

   1) STRIPE PAYMENT LINKS
      Create three Payment Links in your Stripe dashboard (stripe.com)
      for £149, £249 and £349, then paste each URL between the quotes below.
      While a link is left as an empty string ("") every "Reserve" action on
      the site routes visitors to the enquiry form instead — which is the
      correct flow, because customers must enquire and be approved BEFORE
      paying. No secret keys are ever used or stored in the front end.

   2) ENQUIRY FORM ENDPOINT
      The enquiry form needs a form backend to deliver submissions.
      Recommended: create a free form at https://formspree.io (or use
      Netlify Forms if you deploy there), then paste the endpoint URL into
      `enquiryEndpoint`. While it is left as an empty string the form
      validates input but honestly tells visitors it is not connected yet —
      it will never pretend a message was sent.
   ========================================================================== */

window.LR_CONFIG = {
  /* Where enquiries are posted. Example: "https://formspree.io/f/abcdwxyz" */
  enquiryEndpoint: "",

  /* Shown as the human fallback while no endpoint is connected. */
  contactEmail: "hello@landingrescue.co.uk",

  /* Stripe Payment Links — paste your live links here when ready. */
  stripeLinks: {
    heroRescue:       "",   /* £149 */
    fullLandingPage:  "",   /* £249 */
    conversionRescue: ""    /* £349 */
  },

  /* Public business details used around the site. */
  businessName: "Landing Rescue",
  location: "United Kingdom"
};
