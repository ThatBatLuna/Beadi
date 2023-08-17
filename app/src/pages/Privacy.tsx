import { Typo, TypoLink } from "@beadi/components";
import { FunctionComponent } from "react";

export const Privacy: FunctionComponent = ({}) => {
  return (
    <article>
      <Typo element="h1" page>
        Privacy Policy for Beadi
      </Typo>

      <p>
        One of my ("Mona Mayrhofer", "we", "our", "us", "I", "me", or "mine") main priorities with Beadi is to retain the privacy and
        discretion of the visitors and I strive to minimize it to the absolute necessary minimum. This Privacy Policy will explain how we
        use the personal data we collect from you when you use the website, at
        <TypoLink to={import.meta.env.VITE_APP_PUBLIC_URL}>{import.meta.env.VITE_APP_PUBLIC_URL}</TypoLink> or
        <TypoLink to={import.meta.env.VITE_BETA_APP_PUBLIC_URL}>{import.meta.env.VITE_BETA_APP_PUBLIC_URL}</TypoLink>.
      </p>

      <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at:</p>
      <ul>
        <li>
          Email: <a href="email:lunathebat@proton.me">lunathebat@proton.me</a>
        </li>
      </ul>

      <Typo element="h2" page>
        What data do we collect?
      </Typo>
      <ul>
        <li>
          <Typo element="b" page>
            Information you provide us voluntarily
          </Typo>
          We collect any data that you decide to provide us directly, by filling out forms or inputs on the website, sending e-mails or
          otherwisely communicate with us.
        </li>
        <li>
          <Typo element="b" page>
            Information you provide us by using the service
          </Typo>
          We collect the data you provide when using the service, like remote-control activity, chat, cloud-saves etc.
        </li>
        <li>
          <Typo element="b" page>
            Information about the usage of the website
          </Typo>
          We collect regular usage information about the usage of the website and the editor, like which pages are visited or which features
          are used within the editor.
        </li>
      </ul>

      <Typo element="h2" page>
        How do we collect your data?
      </Typo>

      <p>You directly provide most of the data we collect. We collect data and process data when you</p>
      <ul>
        <li>Voluntarily send messages, e-mails or communicate with us in any other way</li>
        <li>
          Use or view the website, either via log-files or via automated reports about which pages are viewed or what features of the editor
          are used.
        </li>
        <li>Use features of our service that requires data to be sent to our servers, like remote-control, chat or cloud-saves</li>
      </ul>

      <Typo element="h2" page>
        How will we use your data?
      </Typo>
      <p>We collect your data so that we can:</p>
      <ul>
        <li>Provide you with functionality of our service that requires data to be sent to our servers.</li>
        <li>Get a rough estimate about how many users are using our services and what features are most important to them</li>
        <li>Get information about possible errors or crashes, so that we can fix them and improve our services.</li>
      </ul>

      <Typo element="h2" page>
        How do we store your data?
      </Typo>
      <p>
        We securely store your data in Linz, Austria and make sure to keep them to a bare minimum. We are aware of the possible risks that
        come with storing user data and are committed to keep it safe.
      </p>

      <p>Data associated with your user account will be stored until you delete you account.</p>

      <p>Data collected for analytical/statistical purposes will be anonymized as soon as we get it.</p>

      <Typo element="h2" page>
        How do we share your information?
      </Typo>
      <ul>
        <li>
          <Typo element="b" page>
            The public and other users of the service
          </Typo>
          <p>
            Content that you publish to public areas of the service (chat, remote-control, etc.) will be shared with other users of the
            service.
          </p>
        </li>
        <li>
          <Typo element="b" page>
            Service Providers and Processors
          </Typo>
          <p>
            In order to provide services to you we rely on others to provide us services. Certain Service providers (also known as
            "processors") critical services, such as hosting (storing and delivering the webpage). We authorize such service providers to
            use or disclose the Personal Information shared with them
          </p>
        </li>
      </ul>

      <Typo element="h2" page>
        What are your data protection rights?
      </Typo>
      <p>We would like to make sure you are fully aware of all your data protection rights. Every user is entitled to the following:</p>
      <ul>
        <li>
          <Typo element="b" page>
            The right to access
          </Typo>
          You have the right to request us for copies of the data we collected from you. If the extent of your request exceeds reasonable
          bounds, we may charge you a small fee for this service.
        </li>
        <li>
          <Typo element="b" page>
            The right to rectification
          </Typo>
          You have the right to request that we correct any information you believe is inaccurate. You also have the right to request us to
          complete information you believe is incomplete.
        </li>
        <li>
          <Typo element="b" page>
            The right to erasure
          </Typo>
          You have the right to request that we erase your personal data, under certain conditions.
        </li>
        <li>
          <Typo element="b" page>
            The right to restrict processing
          </Typo>
          You have the right to request us to restrict the processing of your personal data, under certain conditions.
        </li>
        <li>
          <Typo element="b" page>
            The right to object to processing
          </Typo>
          You have the right to object to our processing of your personal data, under certain conditions.
        </li>
        <li>
          <Typo element="b" page>
            The right to data portability
          </Typo>
          You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under
          certain conditions.
        </li>
      </ul>

      <p>
        If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at
        our email: <a href="email:lunathebat@proton.me">lunathebat@proton.me</a>
      </p>

      <Typo element="h2" page>
        What are cookies/localstorage/IndexedDB?
      </Typo>
      <p>
        Cookies/localstorage/IndexedDB and similar technologies are a way, provided by your Browser, to store small amounts of data on your
        PC. They are primarily used by us to enhance the function of our service (e.g enabling us to store settings/saves locally instead of
        having to transfer them to our servers). They can also be used to track visitors and user behaviour.
      </p>
      <p>For further information, visit allaboutcookies.org</p>

      <Typo element="h2" page>
        How do we use cookies/localstorage/IndexedDB?
      </Typo>
      <p>We use cookies/localstorage/IndexedDB exclusively to</p>
      <ul>
        <li>Keep you signed in if you have a user account</li>
        <li>Store settings and saves of the editor directly on your pc</li>
      </ul>

      <Typo element="h2" page>
        What types of cookies do we use?
      </Typo>
      <p>There are a number of different types of cookies, however our website ues:</p>
      <ul>
        <li>
          Functionality - We use these cookies so that we can store your saves, settings and recognizing you when you return to our website.
        </li>
        <li>We do not use any cookies for advertising</li>
      </ul>

      <Typo element="h2" page>
        How to manage cookies
      </Typo>
      <p>
        You can set your browser not to accept cookies, and the website mentioned above will tell you how to remove cookies. However as most
        of our functionality relies on cookies, the quality of our services may degrade.
      </p>

      <Typo element="h2" page>
        Privacy Policies of other websites
      </Typo>
      <p>
        The Beadi website contains links to other websites. This privacy policy only applies to our websites, so if you click a link to
        another website, you should read their privacy policy.
      </p>

      <Typo element="h2" page>
        Changes to our privacy policy
      </Typo>
      <p>
        We keep our privacy policy under regular review and place any updates on this website. This privacy policy was last updated on the
        16 August 2023
      </p>
    </article>
  );
};
