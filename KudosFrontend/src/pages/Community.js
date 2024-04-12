/**
 * @TODO
 * implement an interactive map showing where events are
 * display partnered organizations
 * upvote/downvote
 */

import { InlineReactionButtons } from "sharethis-reactjs";

const Community = () => {
  document.title = "Community | Kudos";

  return (
    <div className="root-content">
      <div className="community-layout">
        <div className="panel-container-sq community-block">
          <div className="faq-list">
            <div>
              <details>
                <summary style={{ textAlign: "left" }}>
                  What are the differences between requests, offers, and events?
                </summary>
                <p className="faq-content">
                  Requests are specific needs that someone or an organization
                  may have, such as tutoring for their child or assistance with
                  an errand, and other users can apply to fulfill these needs.
                  Offers, on the other hand, are offered by members of the
                  community who wish to assist others with their skills, such as
                  graphic design or pet care. Events are posted by people or
                  organizations to publicize something that is open to the
                  public, such as concerts, conferences, or volunteer
                  opportunities.
                </p>
              </details>
            </div>
            <div>
              <details>
                <summary style={{ textAlign: "left" }}>
                  How does the Kudos platform facilitate requests, offers, and
                  events?
                </summary>
                <p className="faq-content">
                  1. Firstly, a user creates a post (listing) and shares it with
                  the Kudos community.<br></br>
                  <br></br>
                  2. Others can then apply to these posts, with applicants
                  needing to write an application on why they are
                  qualified/interested if the post is a request or an offer.
                  This allows the requester to vet the applicants beforehand and
                  view the applicant's past history on the website. If the post
                  is an event, the application will be automatically approved.
                  <br></br>
                  <br></br>
                  3. Once the application is approved, both parties' contact
                  information (email) will be available to each other, allowing
                  them to contact each other off of the Kudos platform and
                  arrange the details of the listing.<br></br>
                  <br></br>
                  4. Finally, both parties can create a review of each other and
                  rate each other on the website.
                </p>
              </details>
            </div>
            <div>
              <details>
                <summary style={{ textAlign: "left" }}>
                  What do I do if I have encountered a bug?
                </summary>
                <p className="faq-content">
                  we encourage you to submit a detailed bug report to our
                  support team at <b>support@kudosconnect.org</b>. This should
                  include any relevant screenshots and browser specifications,
                  so that we can identify and address the issue as quickly as
                  possible. We appreciate your help in making Kudos a better
                  platform for everyone to use.
                </p>
              </details>
            </div>
            <div>
              <details>
                <summary style={{ textAlign: "left" }}>
                  How can I contribute to Kudos?
                </summary>
                <p className="faq-content">
                  Kudos is excited to have high schoolers join our team as part
                  of our outreach and marketing efforts or design and
                  engineering teams. If you're interested in getting involved,
                  please email us at <b>support@kudosconnect.org</b> to learn
                  more about how you can contribute.
                </p>
              </details>
            </div>
            <div>
              <details>
                <summary style={{ textAlign: "left" }}>
                  How can I get my school district, organization, or club
                  verified on Kudos?
                </summary>
                <p className="faq-content">
                  To get verified, simply email <b>support@kudosconnect.org</b>{" "}
                  with the name of your school district, organization, or club
                  and any relevant information that can help us verify its
                  legitimacy. There are many advantages to getting verified,
                  such as getting tags that make your posts and profile stand
                  out and having your posts and profile featured on the website,
                  increasing your publicity. This is especially helpful for high
                  schoolers looking to promote their organizations or clubs to
                  the wider community.
                </p>
              </details>
            </div>
            <div>
              <details>
                <summary style={{ textAlign: "left" }}>
                  What does the "session expired" error message mean?
                </summary>
                <p className="faq-content">
                  If you encounter a "session expired" error message while
                  trying to post or modify your account on Kudos, it means that
                  you have been inactive for too long since your last login or
                  the Kudos website had a recent patch (as we are still under
                  development). To protect your data and security, Kudos
                  requires users to log in again after a period of inactivity
                  before they can make these actions. However, you will not
                  encounter this issue when browsing the community, explore, or
                  profile pages.{" "}
                  <b>
                    To fix this error, simply log out of your account and log
                    back in again.
                  </b>
                </p>
              </details>
            </div>
          </div>
        </div>
        <div className="panel-container-sq community-block">
          <h3>Kudos beta release v0.1</h3>
          <p className="tiny-text-desc">Posted December 12th, 2022</p>
          <p>
            Welcome to the Kudos beta platform! While we are still in the
            process of improving and refining the website, we welcome your
            feedback and suggestions. If you encounter any bugs or issues while
            using the platform, please submit a detailed report to
            support@kudosconnect.org, including screenshots and browser
            specifications if possible to help us reproduce the issue. We also
            welcome new feature ideas, which can be submitted to the same email
            address. Thank you for your help in making Kudos the best it can be!
          </p>
          <div className="share-this-container">
            <InlineReactionButtons
              config={{
                url: "https://www.kudosconnect.org/community/sharethis4",
                alignment: "center",
                enabled: true,
                language: "en",
                reactions: [
                  "slight_smile",
                  "heart_eyes",
                  "astonished",
                  "sob",
                  "rage",
                ],
                size: 25,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
