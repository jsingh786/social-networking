<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(indexes={@ORM\Index(name="sender_ref_idx", columns={"sender_ref_id"} )})
 */
class job
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $job_title;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $job_description;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $job_reference;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $responsibilities;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $skills_n_expertise;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $expiry_date;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $url_fields;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $company_desc;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $job_posted_by;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $apply_from;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $job_image;

    /**
     * @ORM\Column(type="string", length=1024, nullable=true)
     */
    private $company_job_url;

    /**
     * @ORM\Column(type="string", length=1024, nullable=true)
     */
    private $company_job_apply_url;
    /**
     * @ORM\Column(type="string", length=220, nullable=true)
     */
    private $comments;

    /**
     * @ORM\OneToMany(targetEntity="Entities\job_applications", mappedBy="job", cascade={"remove"})
     */
    private $job_applications;

    /**
     * @ORM\OneToMany(targetEntity="Entities\saved_jobs", mappedBy="job", cascade={"remove"})
     */
    private $savedJobs;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\country_ref", inversedBy="job")
     * @ORM\JoinColumn(name="country_ref_id", referencedColumnName="id", nullable=false)
     */
    private $countryRef;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\state", inversedBy="job")
     * @ORM\JoinColumn(name="state_id", referencedColumnName="id")
     */
    private $state;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\city", inversedBy="job")
     * @ORM\JoinColumn(name="city_id", referencedColumnName="id")
     */
    private $city;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\job_function", inversedBy="job")
     * @ORM\JoinColumn(name="job_function_id", referencedColumnName="id")
     */
    private $jobFunction;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\company", inversedBy="job")
     * @ORM\JoinColumn(name="company_id", referencedColumnName="id", nullable=false)
     */
    private $company;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\industry_ref", inversedBy="job")
     * @ORM\JoinColumn(name="industry_ref_id", referencedColumnName="id", nullable=false)
     */
    private $industryRef;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\job_type", inversedBy="job")
     * @ORM\JoinColumn(name="job_type_id", referencedColumnName="id", nullable=false)
     */
    private $jobType;
    /**
     * @ORM\Column(type="integer", length=20, nullable=true)
     */
    private $sender_ref_id;
	/**
	 * @ORM\Column(type="integer", length=1, nullable=true)
	 */
	private $sender_ref_type;

	/**
     * @ORM\ManyToOne(targetEntity="Entities\salary_range", inversedBy="job")
     * @ORM\JoinColumn(name="salary_range_id", referencedColumnName="id")
     */
    private $salaryRange;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\experienece_level", inversedBy="job")
     * @ORM\JoinColumn(name="experienece_level_id", referencedColumnName="id", nullable=false)
     */
    private $experieneceLevel;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\job_status", inversedBy="job")
     * @ORM\JoinColumn(name="job_status_id", referencedColumnName="id", nullable=false)
     */
    private $jobStatus;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="job")
     * @ORM\JoinColumn(name="created_by_user_id", referencedColumnName="id", nullable=false)
     */
    private $ilookUser;
    
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
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getJob_title() {
		return $this->job_title;
	}

	public function setJob_title($job_title) {
		$this->job_title = $job_title;
	}

	public function getJob_description() {
		return $this->job_description;
	}

	public function setJob_description($job_description) {
		$this->job_description = $job_description;
	}

	public function getJob_reference() {
		return $this->job_reference;
	}

	public function setJob_reference($job_reference) {
		$this->job_reference = $job_reference;
	}

	public function getResponsibilities() {
		return $this->responsibilities;
	}

	public function setResponsibilities($responsibilities) {
		$this->responsibilities = $responsibilities;
	}

	public function getSkills_n_expertise() {
		return $this->skills_n_expertise;
	}

	public function setSkills_n_expertise($skills_n_expertise) {
		$this->skills_n_expertise = $skills_n_expertise;
	}

	public function getExpiry_date() {
		return $this->expiry_date;
	}

	public function setExpiry_date($expiry_date) {
		$this->expiry_date = $expiry_date;
	}

	public function getUrl_fields() {
		return $this->url_fields;
	}

	public function setUrl_fields($url_fields) {
		$this->url_fields = $url_fields;
	}

	public function getCompany_desc() {
		return $this->company_desc;
	}

	public function setCompany_desc($company_desc) {
		$this->company_desc = $company_desc;
	}

	public function getJob_posted_by() {
		return $this->job_posted_by;
	}

	public function setJob_posted_by($job_posted_by) {
		$this->job_posted_by = $job_posted_by;
	}

	public function getApply_from() {
		return $this->apply_from;
	}

	public function setApply_from($apply_from) {
		$this->apply_from = $apply_from;
	}

	public function getJob_image() {
		return $this->job_image;
	}

	public function setJob_image($job_image) {
		$this->job_image = $job_image;
	}

	public function getCompany_job_url() {
		return $this->company_job_url;
	}

	public function setCompany_job_url($company_job_url) {
		$this->company_job_url = $company_job_url;
	}
	public function getComments() {
		return $this->comments;
	}

	public function setComments($comments) {
		$this->comments = $comments;
	}


	public function getCompany_job_apply_url() {
		return $this->company_job_apply_url;
	}

	public function setCompany_job_apply_url($company_job_apply_url) {
		$this->company_job_apply_url = $company_job_apply_url;
	}

	public function getJob_applications() {
		return $this->job_applications;
	}

	public function setJob_applications($job_applications) {
		$this->job_applications = $job_applications;
	}

	public function getSavedJobs() {
		return $this->savedJobs;
	}

	public function setSavedJobs($savedJobs) {
		$this->savedJobs = $savedJobs;
	}

	public function getCountryRef() {
		return $this->countryRef;
	}

	public function setCountryRef($countryRef) {
		$this->countryRef = $countryRef;
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

	public function getJobFunction() {
		return $this->jobFunction;
	}

	public function setJobFunction($jobFunction) {
		$this->jobFunction = $jobFunction;
	}

	public function getCompany() {
		return $this->company;
	}

	public function setCompany($company) {
		$this->company = $company;
	}

	public function getIndustryRef() {
		return $this->industryRef;
	}

	public function setIndustryRef($industryRef) {
		$this->industryRef = $industryRef;
	}

	public function getJobType() {
		return $this->jobType;
	}

	public function setJobType($jobType) {
		$this->jobType = $jobType;
	}
	public function getSender_ref_id() {
		return $this->sender_ref_id;
	}

	public function setSender_ref_id($sender_ref_id) {
		$this->sender_ref_id = $sender_ref_id;
	}
	public function getSender_ref_type() {
		return $this->sender_ref_type;
	}

	public function setSender_ref_type($sender_ref_type) {
		$this->sender_ref_type = $sender_ref_type;
	}


	public function getSalaryRange() {
		return $this->salaryRange;
	}

	public function setSalaryRange($salaryRange) {
		$this->salaryRange = $salaryRange;
	}

	public function getExperieneceLevel() {
		return $this->experieneceLevel;
	}

	public function setExperieneceLevel($experieneceLevel) {
		$this->experieneceLevel = $experieneceLevel;
	}

	public function getJobStatus() {
		return $this->jobStatus;
	}

	public function setJobStatus($jobStatus) {
		$this->jobStatus = $jobStatus;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
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

}