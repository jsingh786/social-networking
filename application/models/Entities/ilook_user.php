<?php
namespace Entities;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="ilook_user")
 * @Gedmo\SoftDeleteable(fieldName="deleted_at")
 */
class ilook_user
{
	/**
	 * @ORM\Id
	 * @ORM\Column(type="integer", length=11)
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $id;
	/**
	 * @ORM\Column(type="string", length=20, nullable=true)
	 */
	private $facebook_id;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $created_from;

	/**
	 * @ORM\Column(type="string", length=60, nullable=false)
	 */
	private $username;

	/**
	 * @ORM\Column(type="string", length=60, nullable=true)
	 */
	private $firstname;

	/**
	 * @ORM\Column(type="string", length=60, nullable=true)
	 */
	private $lastname;

	/**
	 * @ORM\Column(type="string", length=60, nullable=true)
	 */
	private $middle_name;

	/**
	 * @ORM\Column(type="string", unique=true, length=60, nullable=true)
	 */
	private $email;

	/**
	 * @ORM\Column(type="string", length=100, nullable=true)
	 */
	private $enc_password;

	/**
	 * @ORM\Column(type="integer", length=1, nullable=true)
	 */
	private $user_type;

	/**
	 * @ORM\Column(type="string", length=15, nullable=true)
	 */
	private $zipcode;

	/**
	 * @ORM\Column(type="string", length=50, nullable=true)
	 */
	private $professional_headline;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $hobbies;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $group_n_association;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $honors_n_awards;

	/**
	 * @ORM\Column(type="string", length=16, nullable=true)
	 */
	private $phone;

	/**
	 * @ORM\Column(type="string", length=60, nullable=true)
	 */
	private $instant_messenger;

	/**
	 * @ORM\Column(type="integer", length=1, nullable=true)
	 */
	private $im_type;

	/**
	 * @ORM\Column(type="integer", length=1, nullable=true)
	 */
	private $jobseeker_display_flag;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $address;

	/**
	 * @ORM\Column(type="string", length=20, nullable=true)
	 */
	private $birthday;

	/**
	 * @ORM\Column(type="integer", length=1, nullable=true)
	 */
	private $martial_status;

	/**
	 * @ORM\Column(type="string", length=10, nullable=true)
	 */
	private $registration_IP;

	/**
	 * @ORM\Column(type="string", nullable=true)
	 */
	private $link_list;

	/**
	 * @ORM\Column(type="integer", length=1, nullable=true)
	 */
	private $registration_type;

	/**
	 * @ORM\Column(type="string", length=100, nullable=true)
	 */
	private $professional_image;

	/**
	 * @ORM\Column(type="integer", length=1, nullable=true)
	 */
	private $status;

	/**
	 * @ORM\Column(type="string", length=20, nullable=true)
	 */
	private $twitter_id;

	/**
	 * @ORM\Column(type="string", length=100, nullable=true)
	 */
	private $reset_password;

	/**
	 * @ORM\Column(type="string", length=16, nullable=true)
	 */
	private $phone_second;

	/**
	 * @ORM\Column(type="string", length=2500, nullable=true)
	 */
	private $professional_exp;

	/**
	 * @ORM\Column(type="string", length=1, nullable=true)
	 */
	private $professional_goals;

	/**
	 * @ORM\Column(type="string", length=50, nullable=true)
	 */
	private $nationality;

	/**
	 * @ORM\Column(type="string", length=200, nullable=true)
	 */
	private $website_url;

	/**
	 * @ORM\Column(type="string", length=200, nullable=true)
	 */
	private $linkedin_url;

	/**
	 * @ORM\Column(type="string", length=200, nullable=true)
	 */
	private $facebook_url;

	/**
	 * @ORM\Column(type="string", length=200, nullable=true)
	 */
	private $twitter_url;

	/**
	 * @ORM\Column(type="integer", length=1, nullable=true)
	 */
	private $main_menu_size;

	/**
	 * @ORM\Column(type="integer", length=1, nullable=true)
	 */
	private $gender;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $device_token;

	/**
	 * @ORM\Column(type="text", nullable=true)
	 */
	private $android_device_token;

	/**
	 * @ORM\Column(type="text", nullable=true)
	 */
	private $OS_X_device_token;
	/**
	 * @ORM\Column(type="integer", length=1, nullable=true)
	 */
	private $login_from_mobile_device;

	/**
	 * @ORM\Column(type="integer", length=1, nullable=true)
	 */
	private $is_job_seeker;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $address_second;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $email_for_job_alerts;

	/**
	 * @ORM\Column(type="date", nullable=true)
	 */
	private $account_closed_on;

	/**
	 * @var datetime $created_at
	 *
	 * @Gedmo\Timestampable(on="create")
	 * @ORM\Column(type="datetime")
	 */
	private $created_at;

	/**
	 * @var datetime $updated_at
	 *
	 * @Gedmo\Timestampable(on="update")
	 * @ORM\Column(type="datetime")
	 */
	private $updated_at;

	/**
	 * @ORM\Column(type="datetime", nullable=true)
	 */
	private $deleted_at;

	/**
	 * @ORM\Column(type="datetime", nullable=true)
	 */
	private $last_login;

	/**
	 * @ORM\Column(type="boolean", nullable=true)
	 */
	private $verified;

	/**
	 * @ORM\Column(type="string", length=20, nullable=true)
	 */
	private $imei;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\socialise_photo_custom_privacy", mappedBy="ilook_user")
	 */
	private $socialise_photo_custom_privacies;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\support_skill", mappedBy="support_skillsIlook_user", cascade={"remove"})
	 */
	private $ilook_usersSupport_skill;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\users_comments_visibility", mappedBy="ilook_user", cascade={"remove"})
	 */
	private $users_comments_visibilities;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\blogs", mappedBy="ilook_user")
	 */
	private $blogses;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\events", mappedBy="ilook_user")
	 */
	private $eventses;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\event_comments", mappedBy="ilook_user")
	 */
	private $event_commentses;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\event_visitors", mappedBy="ilook_user")
	 */
	private $event_visitorses;

	/**
	 * @ORM\OneToMany(
	 *     targetEntity="Entities\link_bookmark_groups",
	 *     mappedBy="link_groupsAssignedUser",
	 *     cascade={"remove"}
	 * )
	 */
	private $assignedUsersLink_group;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\user_bookmark_groups", mappedBy="user_groupsUser", cascade={"remove"})
	 */
	private $usersUser_groups;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\notes", mappedBy="notes_currentUser", cascade={"remove"})
	 */
	private $currentUser_notes;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\wall_post", mappedBy="wall_postsOriginal_user", cascade={"remove"})
	 */
	private $original_usersWall_post;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\wall_post", mappedBy="wall_postsFrom_user", cascade={"remove"})
	 */
	private $from_usersWall_post;


	/**
	 * @ORM\OneToMany(targetEntity="Entities\report_abuse", mappedBy="profileUser", cascade={"remove"})
	 */
	private $reportAbuseProfile;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\likes", mappedBy="likesLiked_by", cascade={"remove"})
	 */
	private $liked_byLikes;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\share", mappedBy="sharesShared_by", cascade={"remove"})
	 */
	private $shared_byShares;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\socialise_photo", mappedBy="socialise_photosPosted_by")
	 */
	private $posted_bysSocialise_photo;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\socialise_album", mappedBy="socialise_albumIlook_user", cascade={"remove"})
	 */
	private $ilook_userSocialise_album;

	/**
	 * @ORM\OneToMany(
	 *     targetEntity="Entities\reference_request",
	 *     mappedBy="reference_requestProvider_user",
	 *     cascade={"remove"}
	 * )
	 */
	private $provider_userReference_request;

	/**
	 * @ORM\OneToMany(
	 *     targetEntity="Entities\feedback_requests",
	 *     mappedBy="feedback_requestProvider_user",
	 *     cascade={"remove"}
	 * )
	 */
	private $provider_userFeedback_request;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\who_viewed_profiles", mappedBy="visitorsIlook_user", cascade={"remove"})
	 */
	private $ilook_userVisitor;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\comments", mappedBy="commentsIlook_user", cascade={"remove"})
	 */
	private $ilook_usersComment;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\user_languages", mappedBy="user_languagesUser", cascade={"remove"})
	 */
	private $usersUser_languages;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\project", mappedBy="projectsUser")
	 */
	private $usersProject;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\publication", mappedBy="publicationsUser")
	 */
	private $usersPublication;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\certification", mappedBy="certificationsUser")
	 */
	private $usersCertification;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\volunteering_n_causes", mappedBy="volunteering_and_causesUser")
	 */
	private $userVolunteering_and_causes;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\user_folder", mappedBy="user_foldersDeletedbyUser", cascade={"remove"})
	 */
	private $DeletedbyusersUser_folder;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\folder", mappedBy="foldersUser")
	 */
	private $usersFolder;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\education_detail", mappedBy="educationsUser", cascade={"remove"})
	 */
	private $usersEducation;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\user_website", mappedBy="websitesUser")
	 */
	private $usersWebsites;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\profile_visitors", mappedBy="profile_visitorsHostUser")
	 */
	private $hostUsersProfile_visitors;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\bookmark_profile", mappedBy="bookmark_profilesUser", cascade={"remove"})
	 */
	private $usersBookmark_profile;

	/**
	 * @ORM\OneToMany(
	 *     targetEntity="Entities\import_external_contacts",
	 *     mappedBy="import_external_contactsUser",
	 *     cascade={"remove"}
	 * )
	 */
	private $usersImport_external_contacts;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\experience", mappedBy="experiencesUser", cascade={"remove"})
	 */
	private $usersExperience;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\user_skills", mappedBy="user_skillsUser", cascade={"remove"})
	 */
	private $usersUser_skills;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\link_requests", mappedBy="link_requestsRecieverUser", cascade={"remove"})
	 */
	private $recieverUsersLink_request;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\user_tags", mappedBy="user_tagsUser", cascade={"remove"})
	 */
	private $usersUser_tags;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\link_tags", mappedBy="link_tagsCreatedbyUser", cascade={"remove"})
	 */
	private $createdbyUsesrLink_tag;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\message", mappedBy="messagesUser")
	 */
	private $usersMessage;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\message_user", mappedBy="message_usersRecieverUser")
	 */
	private $recieverUsersMessage_user;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\job", mappedBy="ilookUser")
	 */
	private $job;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\saved_search", mappedBy="ilookUser", cascade={"remove"})
	 */
	private $savedSearch;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\job_applications", mappedBy="ilookUser", cascade={"remove"})
	 */
	private $jobApplications;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\notifications", mappedBy="aboutIlookUser", cascade={"remove"})
	 */
	private $aboutIlookUserNotifications;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\socialise_album_custom_privacy", mappedBy="ilookUser")
	 */
	private $socialiseAlbumCustomPrivacy;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\wishes", mappedBy="ilookUser", cascade={"remove"})
	 */
	private $wishes;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\blocked_users", mappedBy="ilookUserr", cascade={"remove"})
	 */
	private $blockedUsers;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\notification_settings", mappedBy="ilookUser", cascade={"remove"})
	 */
	private $notificationSettings;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\saved_jobs", mappedBy="ilookUser", cascade={"remove"})
	 */
	private $savedJobs;

	/**
	 * @ORM\OneToOne(targetEntity="Entities\cover_photo", mappedBy="ilookUser")
	 */
	private $coverPhoto;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\push_notifications", mappedBy="ilookUser", cascade={"remove"})
	 */
	private $pushNotifications;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\photo_group", mappedBy="ilookUser", cascade={"remove"})
	 */
	private $photoGroup;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\login_summary", mappedBy="login_summarysUser")
	 */
	private $usersLogin_summary;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\admin_activity_log", mappedBy="ilookUser")
	 */
	private $adminActivityLog;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\posted_to", mappedBy="ilookUser", cascade={"remove"})
	 */
	private $postedTo;
	
	/**
	 * @ORM\OneToOne(targetEntity="Entities\chat_settings", mappedBy="ilookUser", cascade={"remove"})
	 */
	private $chatSettings;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\privacy_settings", mappedBy="ilookUser")
	 */
	private $privacySettings;

	/**
	 * @ORM\OneToMany(targetEntity="Entities\enquiry", mappedBy="ilookUser")
	 */
	private $enquiry;

	/**
	 * @ORM\ManyToOne(targetEntity="Entities\country_ref", inversedBy="countrysUser")
	 * @ORM\JoinColumn(name="country_ref_id", referencedColumnName="id", nullable=false)
	 */
	private $usersCountry;

	/**
	 * @ORM\ManyToOne(targetEntity="Entities\industry_ref", inversedBy="industrysUser")
	 * @ORM\JoinColumn(name="industry_ref_id", referencedColumnName="id")
	 */
	private $usersIndustry;

	/**
	 * @ORM\ManyToOne(targetEntity="Entities\state", inversedBy="ilookUser")
	 * @ORM\JoinColumn(name="state_id", referencedColumnName="id")
	 */
	private $state;

	/**
	 * @ORM\ManyToOne(targetEntity="Entities\city", inversedBy="ilookUser")
	 * @ORM\JoinColumn(name="city_id", referencedColumnName="id")
	 */
	private $city;

	/**
	 * @ORM\ManyToMany(targetEntity="Entities\blog_categories", inversedBy="ilookUser")
	 * @ORM\JoinTable(
	 *     name="blog_categories_ilook_user_mm",
	 *     joinColumns={@ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)},
	 *     inverseJoinColumns={@ORM\JoinColumn(name="blog_categories_id", referencedColumnName="id", nullable=false)}
	 * )
	 */
	private $blogCategories;

	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getFacebook_id() {
		return $this->facebook_id;
	}

	public function setFacebook_id($facebook_id) {
		$this->facebook_id = $facebook_id;
	}

	public function getCreated_from() {
		return $this->created_from;
	}

	public function setCreated_from($created_from) {
		$this->created_from = $created_from;
	}

	public function getUsername() {
		return $this->username;
	}

	public function setUsername($username) {
		$this->username = $username;
	}

	public function getFirstname() {
		return $this->firstname;
	}

	public function setFirstname($firstname) {
		$this->firstname = $firstname;
	}

	public function getLastname() {
		return $this->lastname;
	}

	public function setLastname($lastname) {
		$this->lastname = $lastname;
	}

	public function getMiddle_name() {
		return $this->middle_name;
	}

	public function setMiddle_name($middle_name) {
		$this->middle_name = $middle_name;
	}

	public function getEmail() {
		return $this->email;
	}

	public function setEmail($email) {
		$this->email = $email;
	}

	public function getEnc_password() {
		return $this->enc_password;
	}

	public function setEnc_password($enc_password) {
		$this->enc_password = $enc_password;
	}

	public function getUser_type() {
		return $this->user_type;
	}

	public function setUser_type($user_type) {
		$this->user_type = $user_type;
	}

	public function getZipcode() {
		return $this->zipcode;
	}

	public function setZipcode($zipcode) {
		$this->zipcode = $zipcode;
	}

	public function getProfessional_headline() {
		return $this->professional_headline;
	}

	public function setProfessional_headline($professional_headline) {
		$this->professional_headline = $professional_headline;
	}

	public function getHobbies() {
		return $this->hobbies;
	}

	public function setHobbies($hobbies) {
		$this->hobbies = $hobbies;
	}

	public function getGroup_n_association() {
		return $this->group_n_association;
	}

	public function setGroup_n_association($group_n_association) {
		$this->group_n_association = $group_n_association;
	}

	public function getHonors_n_awards() {
		return $this->honors_n_awards;
	}

	public function setHonors_n_awards($honors_n_awards) {
		$this->honors_n_awards = $honors_n_awards;
	}

	public function getPhone() {
		return $this->phone;
	}

	public function setPhone($phone) {
		$this->phone = $phone;
	}

	public function getInstant_messenger() {
		return $this->instant_messenger;
	}

	public function setInstant_messenger($instant_messenger) {
		$this->instant_messenger = $instant_messenger;
	}

	public function getIm_type() {
		return $this->im_type;
	}

	public function setIm_type($im_type) {
		$this->im_type = $im_type;
	}

	public function getJobseeker_display_flag() {
		return $this->jobseeker_display_flag;
	}

	public function setJobseeker_display_flag($jobseeker_display_flag) {
		$this->jobseeker_display_flag = $jobseeker_display_flag;
	}

	public function getAddress() {
		return $this->address;
	}

	public function setAddress($address) {
		$this->address = $address;
	}

	public function getBirthday() {
		return $this->birthday;
	}

	public function setBirthday($birthday) {
		$this->birthday = $birthday;
	}

	public function getMartial_status() {
		return $this->martial_status;
	}

	public function setMartial_status($martial_status) {
		$this->martial_status = $martial_status;
	}

	public function getRegistration_IP() {
		return $this->registration_IP;
	}

	public function setRegistration_IP($registration_IP) {
		$this->registration_IP = $registration_IP;
	}

	public function getLink_list() {
		return $this->link_list;
	}

	public function setLink_list($link_list) {
		$this->link_list = $link_list;
	}

	public function getRegistration_type() {
		return $this->registration_type;
	}

	public function setRegistration_type($registration_type) {
		$this->registration_type = $registration_type;
	}

	public function getProfessional_image() {
		return $this->professional_image;
	}

	public function setProfessional_image($professional_image) {
		$this->professional_image = $professional_image;
	}

	public function getStatus() {
		return $this->status;
	}

	public function setStatus($status) {
		$this->status = $status;
	}

	public function getTwitter_id() {
		return $this->twitter_id;
	}

	public function setTwitter_id($twitter_id) {
		$this->twitter_id = $twitter_id;
	}

	public function getReset_password() {
		return $this->reset_password;
	}

	public function setReset_password($reset_password) {
		$this->reset_password = $reset_password;
	}

	public function getPhone_second() {
		return $this->phone_second;
	}

	public function setPhone_second($phone_second) {
		$this->phone_second = $phone_second;
	}

	public function getProfessional_exp() {
		return $this->professional_exp;
	}

	public function setProfessional_exp($professional_exp) {
		$this->professional_exp = $professional_exp;
	}

	public function getProfessional_goals() {
		return $this->professional_goals;
	}

	public function setProfessional_goals($professional_goals) {
		$this->professional_goals = $professional_goals;
	}

	public function getNationality() {
		return $this->nationality;
	}

	public function setNationality($nationality) {
		$this->nationality = $nationality;
	}

	public function getWebsite_url() {
		return $this->website_url;
	}

	public function setWebsite_url($website_url) {
		$this->website_url = $website_url;
	}

	public function getLinkedin_url() {
		return $this->linkedin_url;
	}

	public function setLinkedin_url($linkedin_url) {
		$this->linkedin_url = $linkedin_url;
	}

	public function getFacebook_url() {
		return $this->facebook_url;
	}

	public function setFacebook_url($facebook_url) {
		$this->facebook_url = $facebook_url;
	}

	public function getTwitter_url() {
		return $this->twitter_url;
	}

	public function setTwitter_url($twitter_url) {
		$this->twitter_url = $twitter_url;
	}

	public function getMain_menu_size() {
		return $this->main_menu_size;
	}

	public function setMain_menu_size($main_menu_size) {
		$this->main_menu_size = $main_menu_size;
	}

	public function getGender() {
		return $this->gender;
	}

	public function setGender($gender) {
		$this->gender = $gender;
	}

	public function getDevice_token() {
		return $this->device_token;
	}

	public function setDevice_token($device_token) {
		$this->device_token = $device_token;
	}
	public function getAndroid_device_token() {
		return $this->android_device_token;
	}

	public function setAndroid_device_token($android_device_token) {
		$this->android_device_token = $android_device_token;
	}
	public function getOS_X_device_token() {
		return $this->OS_X_device_token;
	}

	public function setOS_X_device_token($OS_X_device_token) {
		$this->OS_X_device_token = $OS_X_device_token;
	}

	public function getLogin_from_mobile_device() {
		return $this->login_from_mobile_device;
	}

	public function setLogin_from_mobile_device($login_from_mobile_device) {
		$this->login_from_mobile_device = $login_from_mobile_device;
	}

	public function getIs_job_seeker() {
		return $this->is_job_seeker;
	}

	public function setIs_job_seeker($is_job_seeker) {
		$this->is_job_seeker = $is_job_seeker;
	}

	public function getAddress_second() {
		return $this->address_second;
	}

	public function setAddress_second($address_second) {
		$this->address_second = $address_second;
	}

	public function getEmail_for_job_alerts() {
		return $this->email_for_job_alerts;
	}

	public function setEmail_for_job_alerts($email_for_job_alerts) {
		$this->email_for_job_alerts = $email_for_job_alerts;
	}

	public function getAccount_closed_on() {
		return $this->account_closed_on;
	}

	public function setAccount_closed_on($account_closed_on) {
		$this->account_closed_on = $account_closed_on;
	}

	public function getCreated_at() {
		return $this->created_at;
	}

	public function setCreated_at($created_at) {
		$this->created_at = $created_at;
	}

	public function getUpdated_at() {
		return $this->updated_at;
	}

	public function setUpdated_at($updated_at) {
		$this->updated_at = $updated_at;
	}

	public function getDeleted_at() {
		return $this->deleted_at;
	}

	public function setDeleted_at($deleted_at) {
		$this->deleted_at = $deleted_at;
	}

	public function getLast_login() {
		return $this->last_login;
	}

	public function setLast_login($last_login) {
		$this->last_login = $last_login;
	}

	public function getVerified() {
		return $this->verified;
	}

	public function setVerified($verified) {
		$this->verified = $verified;
	}

	public function getImei() {
		return $this->imei;
	}

	public function setImei($imei) {
		$this->imei = $imei;
	}

	public function getSocialise_photo_custom_privacies() {
		return $this->socialise_photo_custom_privacies;
	}

	public function setSocialise_photo_custom_privacies($socialise_photo_custom_privacies) {
		$this->socialise_photo_custom_privacies = $socialise_photo_custom_privacies;
	}

	public function getIlook_usersSupport_skill() {
		return $this->ilook_usersSupport_skill;
	}

	public function setIlook_usersSupport_skill($ilook_usersSupport_skill) {
		$this->ilook_usersSupport_skill = $ilook_usersSupport_skill;
	}

	public function getUsers_comments_visibilities() {
		return $this->users_comments_visibilities;
	}

	public function setUsers_comments_visibilities($users_comments_visibilities) {
		$this->users_comments_visibilities = $users_comments_visibilities;
	}

	public function getBlogses() {
		return $this->blogses;
	}

	public function setBlogses($blogses) {
		$this->blogses = $blogses;
	}

	public function getEventses() {
		return $this->eventses;
	}

	public function setEventses($eventses) {
		$this->eventses = $eventses;
	}

	public function getEvent_commentses() {
		return $this->event_commentses;
	}

	public function setEvent_commentses($event_commentses) {
		$this->event_commentses = $event_commentses;
	}

	public function getEvent_visitorses() {
		return $this->event_visitorses;
	}

	public function setEvent_visitorses($event_visitorses) {
		$this->event_visitorses = $event_visitorses;
	}

	public function getAssignedUsersLink_group() {
		return $this->assignedUsersLink_group;
	}

	public function setAssignedUsersLink_group($assignedUsersLink_group) {
		$this->assignedUsersLink_group = $assignedUsersLink_group;
	}

	public function getUsersUser_groups() {
		return $this->usersUser_groups;
	}

	public function setUsersUser_groups($usersUser_groups) {
		$this->usersUser_groups = $usersUser_groups;
	}

	public function getCurrentUser_notes() {
		return $this->currentUser_notes;
	}

	public function setCurrentUser_notes($currentUser_notes) {
		$this->currentUser_notes = $currentUser_notes;
	}

	public function getReportAbuseProfile() {
		return $this->reportAbuseProfile;
	}

	public function setReportAbuseProfile($reportAbuseProfile) {
		$this->reportAbuseProfile = $reportAbuseProfile;
	}

	public function getOriginal_usersWall_post() {
		return $this->original_usersWall_post;
	}

	public function setOriginal_usersWall_post($original_usersWall_post) {
		$this->original_usersWall_post = $original_usersWall_post;
	}

	public function getFrom_usersWall_post() {
		return $this->from_usersWall_post;
	}

	public function setFrom_usersWall_post($from_usersWall_post) {
		$this->from_usersWall_post = $from_usersWall_post;
	}

	public function getLiked_byLikes() {
		return $this->liked_byLikes;
	}

	public function setLiked_byLikes($liked_byLikes) {
		$this->liked_byLikes = $liked_byLikes;
	}

	public function getShared_byShares() {
		return $this->shared_byShares;
	}

	public function setShared_byShares($shared_byShares) {
		$this->shared_byShares = $shared_byShares;
	}

	public function getPosted_bysSocialise_photo() {
		return $this->posted_bysSocialise_photo;
	}

	public function setPosted_bysSocialise_photo($posted_bysSocialise_photo) {
		$this->posted_bysSocialise_photo = $posted_bysSocialise_photo;
	}

	public function getIlook_userSocialise_album() {
		return $this->ilook_userSocialise_album;
	}

	public function setIlook_userSocialise_album($ilook_userSocialise_album) {
		$this->ilook_userSocialise_album = $ilook_userSocialise_album;
	}

	public function getProvider_userReference_request() {
		return $this->provider_userReference_request;
	}

	public function setProvider_userReference_request($provider_userReference_request) {
		$this->provider_userReference_request = $provider_userReference_request;
	}

	public function getProvider_userFeedback_request() {
		return $this->provider_userFeedback_request;
	}

	public function setProvider_userFeedback_request($provider_userFeedback_request) {
		$this->provider_userFeedback_request = $provider_userFeedback_request;
	}

	public function getIlook_userVisitor() {
		return $this->ilook_userVisitor;
	}

	public function setIlook_userVisitor($ilook_userVisitor) {
		$this->ilook_userVisitor = $ilook_userVisitor;
	}

	public function getIlook_usersComment() {
		return $this->ilook_usersComment;
	}

	public function setIlook_usersComment($ilook_usersComment) {
		$this->ilook_usersComment = $ilook_usersComment;
	}

	public function getUsersUser_languages() {
		return $this->usersUser_languages;
	}

	public function setUsersUser_languages($usersUser_languages) {
		$this->usersUser_languages = $usersUser_languages;
	}

	public function getUsersProject() {
		return $this->usersProject;
	}

	public function setUsersProject($usersProject) {
		$this->usersProject = $usersProject;
	}

	public function getUsersPublication() {
		return $this->usersPublication;
	}

	public function setUsersPublication($usersPublication) {
		$this->usersPublication = $usersPublication;
	}

	public function getUsersCertification() {
		return $this->usersCertification;
	}

	public function setUsersCertification($usersCertification) {
		$this->usersCertification = $usersCertification;
	}

	public function getUserVolunteering_and_causes() {
		return $this->userVolunteering_and_causes;
	}

	public function setUserVolunteering_and_causes($userVolunteering_and_causes) {
		$this->userVolunteering_and_causes = $userVolunteering_and_causes;
	}

	public function getDeletedbyusersUser_folder() {
		return $this->DeletedbyusersUser_folder;
	}

	public function setDeletedbyusersUser_folder($DeletedbyusersUser_folder) {
		$this->DeletedbyusersUser_folder = $DeletedbyusersUser_folder;
	}

	public function getUsersFolder() {
		return $this->usersFolder;
	}

	public function setUsersFolder($usersFolder) {
		$this->usersFolder = $usersFolder;
	}

	public function getUsersEducation() {
		return $this->usersEducation;
	}

	public function setUsersEducation($usersEducation) {
		$this->usersEducation = $usersEducation;
	}

	public function getUsersWebsites() {
		return $this->usersWebsites;
	}

	public function setUsersWebsites($usersWebsites) {
		$this->usersWebsites = $usersWebsites;
	}

	public function getHostUsersProfile_visitors() {
		return $this->hostUsersProfile_visitors;
	}

	public function setHostUsersProfile_visitors($hostUsersProfile_visitors) {
		$this->hostUsersProfile_visitors = $hostUsersProfile_visitors;
	}

	public function getUsersBookmark_profile() {
		return $this->usersBookmark_profile;
	}

	public function setUsersBookmark_profile($usersBookmark_profile) {
		$this->usersBookmark_profile = $usersBookmark_profile;
	}

	public function getUsersImport_external_contacts() {
		return $this->usersImport_external_contacts;
	}

	public function setUsersImport_external_contacts($usersImport_external_contacts) {
		$this->usersImport_external_contacts = $usersImport_external_contacts;
	}

	public function getUsersExperience() {
		return $this->usersExperience;
	}

	public function setUsersExperience($usersExperience) {
		$this->usersExperience = $usersExperience;
	}

	public function getUsersUser_skills() {
		return $this->usersUser_skills;
	}

	public function setUsersUser_skills($usersUser_skills) {
		$this->usersUser_skills = $usersUser_skills;
	}

	public function getRecieverUsersLink_request() {
		return $this->recieverUsersLink_request;
	}

	public function setRecieverUsersLink_request($recieverUsersLink_request) {
		$this->recieverUsersLink_request = $recieverUsersLink_request;
	}

	public function getUsersUser_tags() {
		return $this->usersUser_tags;
	}

	public function setUsersUser_tags($usersUser_tags) {
		$this->usersUser_tags = $usersUser_tags;
	}

	public function getCreatedbyUsesrLink_tag() {
		return $this->createdbyUsesrLink_tag;
	}

	public function setCreatedbyUsesrLink_tag($createdbyUsesrLink_tag) {
		$this->createdbyUsesrLink_tag = $createdbyUsesrLink_tag;
	}

	public function getUsersMessage() {
		return $this->usersMessage;
	}

	public function setUsersMessage($usersMessage) {
		$this->usersMessage = $usersMessage;
	}

	public function getRecieverUsersMessage_user() {
		return $this->recieverUsersMessage_user;
	}

	public function setRecieverUsersMessage_user($recieverUsersMessage_user) {
		$this->recieverUsersMessage_user = $recieverUsersMessage_user;
	}

	public function getJob() {
		return $this->job;
	}

	public function setJob($job) {
		$this->job = $job;
	}

	public function getSavedSearch() {
		return $this->savedSearch;
	}

	public function setSavedSearch($savedSearch) {
		$this->savedSearch = $savedSearch;
	}

	public function getJobApplications() {
		return $this->jobApplications;
	}

	public function setJobApplications($jobApplications) {
		$this->jobApplications = $jobApplications;
	}

	public function getAboutIlookUserNotifications() {
		return $this->aboutIlookUserNotifications;
	}

	public function setAboutIlookUserNotifications($aboutIlookUserNotifications) {
		$this->aboutIlookUserNotifications = $aboutIlookUserNotifications;
	}

	public function getSocialiseAlbumCustomPrivacy() {
		return $this->socialiseAlbumCustomPrivacy;
	}

	public function setSocialiseAlbumCustomPrivacy($socialiseAlbumCustomPrivacy) {
		$this->socialiseAlbumCustomPrivacy = $socialiseAlbumCustomPrivacy;
	}

	public function getWishes() {
		return $this->wishes;
	}

	public function setWishes($wishes) {
		$this->wishes = $wishes;
	}

	public function getBlockedUsers() {
		return $this->blockedUsers;
	}

	public function setBlockedUsers($blockedUsers) {
		$this->blockedUsers = $blockedUsers;
	}

	public function getNotificationSettings() {
		return $this->notificationSettings;
	}

	public function setNotificationSettings($notificationSettings) {
		$this->notificationSettings = $notificationSettings;
	}

	public function getSavedJobs() {
		return $this->savedJobs;
	}

	public function setSavedJobs($savedJobs) {
		$this->savedJobs = $savedJobs;
	}

	public function getCoverPhoto() {
		return $this->coverPhoto;
	}

	public function setCoverPhoto($coverPhoto) {
		$this->coverPhoto = $coverPhoto;
	}

	public function getPushNotifications() {
		return $this->pushNotifications;
	}

	public function setPushNotifications($pushNotifications) {
		$this->pushNotifications = $pushNotifications;
	}

	public function getPhotoGroup() {
		return $this->photoGroup;
	}

	public function setPhotoGroup($photoGroup) {
		$this->photoGroup = $photoGroup;
	}

	public function getUsersLogin_summary() {
		return $this->usersLogin_summary;
	}

	public function setUsersLogin_summary($usersLogin_summary) {
		$this->usersLogin_summary = $usersLogin_summary;
	}

	public function getAdminActivityLog() {
		return $this->adminActivityLog;
	}

	public function setAdminActivityLog($adminActivityLog) {
		$this->adminActivityLog = $adminActivityLog;
	}

	public function getPostedTo() {
		return $this->postedTo;
	}

	public function setPostedTo($postedTo) {
		$this->postedTo = $postedTo;
	}

	public function getChatSettings() {
		return $this->chatSettings;
	}

	public function setChatSettings($chatSettings) {
		$this->chatSettings = $chatSettings;
	}

	public function getPrivacySettings() {
		return $this->privacySettings;
	}

	public function setPrivacySettings($privacySettings) {
		$this->privacySettings = $privacySettings;
	}

	public function getEnquiry() {
		return $this->enquiry;
	}

	public function setEnquiry($enquiry) {
		$this->enquiry = $enquiry;
	}

	public function getUsersCountry() {
		return $this->usersCountry;
	}

	public function setUsersCountry($usersCountry) {
		$this->usersCountry = $usersCountry;
	}

	public function getUsersIndustry() {
		return $this->usersIndustry;
	}

	public function setUsersIndustry($usersIndustry) {
		$this->usersIndustry = $usersIndustry;
	}

	public function getState() {
		return $this->state;
	}

	public function setState($state) {
		$this->state = $state;
	}

	public function getCity() {
		return $this->city;
	}

	public function setCity($city) {
		$this->city = $city;
	}

	public function getBlog_categorieses() {
		return $this->blog_categorieses;
	}

	public function setBlog_categorieses($blog_categorieses) {
		$this->blog_categorieses = $blog_categorieses;
	}

}