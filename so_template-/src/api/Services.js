import simg1 from '../images/service/1.png';
import simg2 from '../images/service/2.png';
import simg3 from '../images/service/3.png';
import simg4 from '../images/service/4.png';



import sSimg1 from '../images/service-single/1.png';
import sSimg2 from '../images/service-single/2.png';
import sSimg3 from '../images/service-single/3.png';

const Services = [
   {
      Id: '01',
      sImg: simg1,
      sSImg: sSimg1,
      title: 'Become a Donor or Backer',
      slug: 'donor',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
      description: 'Support impactful, verified community projects and help create sustainable change.',
      steps: [
        {
          icon: 'fas fa-search',
          title: 'Discover Projects',
          description: 'Browse verified community-led initiatives that match your interests.',
          fullGuide: 'Use filters by location, category, or urgency to explore live fundraising campaigns. Each project includes details, images, updates, and specific goals.'
        },
        {
          icon: 'fas fa-info-circle',
          title: 'Read Project Details',
          description: 'Learn about the community, needs, and goals.',
          fullGuide: 'Each campaign includes background information, financial breakdown, timeline, and impact updates. Read reviews and check updates from the community and organization.'
        },
        {
          icon: 'fas fa-hand-holding-heart',
          title: 'Choose Amount & Frequency',
          description: 'Decide how much and how often you want to give.',
          fullGuide: 'You can make a one-time donation or set up recurring monthly support for long-term projects.'
        },
        {
          icon: 'fas fa-donate',
          title: 'Select Payment Method',
          description: 'Pay securely via mobile money, card, or bank transfer.',
          fullGuide: 'We support multiple options: Telesom, Zaad, Mastercard, Visa, and local banks. Your payment is securely processed and confirmed instantly.'
        },
        {
          icon: 'fas fa-receipt',
          title: 'Receive Confirmation',
          description: 'Get a digital receipt and project tracking link.',
          fullGuide: 'After payment, you’ll receive an email or SMS confirmation with your donation details and a link to track progress.'
        },
        {
          icon: 'fas fa-heart',
          title: 'Track Your Impact',
          description: 'See updates and progress reports from the field.',
          fullGuide: 'Follow how your funds are used through real-time updates, photos, videos, and milestone reports shared by project leaders.'
        }
      ]
    }
    
,
   {
      Id: '02',
      sImg: simg2,
      sSImg: sSimg2,
      title: 'Become a Partner',
      slug: 'partner',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
      description: 'Partner with Sokaab to support and scale verified community-driven development initiatives.',
      steps: [
        {
          icon: 'fas fa-file-alt',
          title: 'Submit Partnership Proposal',
          description: 'Organizations express interest by submitting a partnership proposal.',
          fullGuide: 'Potential partners submit detailed proposals outlining their mission, target communities, and how they intend to support Sokaab projects (financially, technically, or logistically).'
        },
        {
          icon: 'fas fa-users-cog',
          title: 'Review and Vetting',
          description: 'Sokaab reviews the proposal and assesses alignment with its mission.',
          fullGuide: 'Our team evaluates the partner’s objectives, track record, and capacity to collaborate effectively with communities and local stakeholders.'
        },
        {
          icon: 'fas fa-handshake',
          title: 'Formal Agreement',
          description: 'Sign a partnership agreement to begin collaboration.',
          fullGuide: 'Once approved, Sokaab and the partner sign an MoU or service agreement outlining roles, responsibilities, and collaboration frameworks.'
        },
        {
          icon: 'fas fa-project-diagram',
          title: 'Start Co-Funding Projects',
          description: 'Partners begin supporting selected community projects.',
          fullGuide: 'Partners co-fund, monitor, and help scale grassroots projects in collaboration with Sokaab and local project committees.'
        }
      ]
    }
,    
   {Id: '03',
      sImg: simg3,
      sSImg: sSimg3,
      title: 'Launch a Community Project',
      slug: 'Launch a Community Project',
      description: 'Launch projects and raise funds to bring your community’s ideas to life.',
      videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
      steps: [
         {
            icon: 'fas fa-building',
            title: 'Register Organization',
            description: 'Register your organization on Sokaab.',
            fullGuide: 'Complete the registration process for your organization to access the platform.'
         },
         {
            icon: 'fas fa-file-signature',
            title: 'Sign Service Agreement',
            description: 'Sign a service agreement with Sokaab.',
            fullGuide: 'Agree to the terms and conditions set by Sokaab to proceed with project creation.'
         },
         {
            icon: 'fas fa-video',
            title: 'Watch Tutorial',
            description: 'Watch the tutorial on how to create a project.',
            fullGuide: 'Familiarize yourself with the platform’s tools and processes by viewing the tutorial.'
         },
         {
            icon: 'fas fa-users-cog',
            title: 'Upload VDC Information',
            description: 'Upload the Village Development Committee (VDC) details.',
            fullGuide: 'Submit necessary information about the village or community development committee.'
         },
         {
            icon: 'fas fa-users',
            title: 'Establish Project Committee',
            description: 'Create a community project management committee.',
            fullGuide: 'Set up the committee with roles like Chair, Vice Chair, Treasurer, Secretary, and Members.'
         },
         {
            icon: 'fas fa-university',
            title: 'Set Up Community Account',
            description: 'Establish a community project account.',
            fullGuide: 'Open an account dedicated to managing the community project’s funds and activities.'
         },
         {
            icon: 'fas fa-file-contract',
            title: 'Notarized Authorization Letter',
            description: 'Secure a notarized authorization letter.',
            fullGuide: 'Ensure proper documentation for connecting your project to Sokaab.'
         },
         {
            icon: 'fas fa-plus-circle',
            title: 'Create Project on Sokaab',
            description: 'Create your community project in the Sokaab system.',
            fullGuide: 'Enter all necessary details about your project, including goals and budget.'
         },
         {
            icon: 'fas fa-upload',
            title: 'Upload Authorization Letter',
            description: 'Upload the notarized authorization letter.',
            fullGuide: 'Submit the official notarized letter to complete project verification.'
         },
         {
            icon: 'fas fa-money-check-alt',
            title: 'Choose Payment Options',
            description: 'Choose your payment methods.',
            fullGuide: 'Select from available options like Zaad, mobile money, or bank accounts.'
         },
         {
            icon: 'fas fa-credit-card',
            title: 'Add Payment Account Details',
            description: 'Enter account details for payments.',
            fullGuide: 'Provide account information for processing payments and donations.'
         },
         {
            icon: 'fas fa-globe',
            title: 'Enable International Payment Gateways',
            description: 'Enable international payment gateways for global contributors.',
            fullGuide: 'Choose to accept international contributions by activating payment options.'
         },
         {
            icon: 'fas fa-share-alt',
            title: 'Share Authorization Letter',
            description: 'Share the community account authorization letter with Shaqodoon.',
            fullGuide: 'Send the letter for verification with your partner bank or mobile provider.'
         },
         {
            icon: 'fas fa-shield-alt',
            title: 'Verify with Shaqodoon',
            description: 'Shaqodoon verifies your letter.',
            fullGuide: 'Shaqodoon cross-checks the letter with your bank or mobile provider for authenticity.'
         },
         {
            icon: 'fas fa-code',
            title: 'API Information Shared',
            description: 'Account API information shared with Shaqodoon.',
            fullGuide: 'Shaqodoon receives necessary technical data to link your account with Sokaab.'
         },
         {
            icon: 'fas fa-rocket',
            title: 'Project Goes Live',
            description: 'Your project is now live.',
            fullGuide: 'The community project is officially launched and open for support.'
         }
      ]
   }
 ];
 
export default Services;
