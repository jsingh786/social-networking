<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class saved_search
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100, nullable=false)
     */
    private $save_search_name;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $date_from;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $date_to;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $job_title;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\job_function", inversedBy="savedSearch")
     * @ORM\JoinColumn(name="job_function_id", referencedColumnName="id")
     */
    private $jobFunction;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\country_ref", inversedBy="savedSearch")
     * @ORM\JoinColumn(name="country_ref_id", referencedColumnName="id")
     */
    private $countryRef;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\city", inversedBy="savedSearch")
     * @ORM\JoinColumn(name="city_id", referencedColumnName="id")
     */
    private $city;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\state", inversedBy="savedSearch")
     * @ORM\JoinColumn(name="state_id", referencedColumnName="id")
     */
    private $state;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\company", inversedBy="savedSearch")
     * @ORM\JoinColumn(name="company_id", referencedColumnName="id")
     */
    private $company;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\industry_ref", inversedBy="savedSearch")
     * @ORM\JoinColumn(name="industry_ref_id", referencedColumnName="id")
     */
    private $industryRef;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\salary_range", inversedBy="savedSearch")
     * @ORM\JoinColumn(name="salary_range_id", referencedColumnName="id")
     */
    private $salaryRange;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\job_type", inversedBy="savedSearch")
     * @ORM\JoinColumn(name="job_type_id", referencedColumnName="id")
     */
    private $jobType;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\experienece_level", inversedBy="savedSearch")
     * @ORM\JoinColumn(name="experienece_level_id", referencedColumnName="id")
     */
    private $experieneceLevel;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\recieve_alerts", inversedBy="savedSearch")
     * @ORM\JoinColumn(name="recieve_alerts_id", referencedColumnName="id")
     */
    private $recieveAlerts;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="savedSearch")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id")
     */
    private $ilookUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getSave_search_name() {
		return $this->save_search_name;
	}

	public function setSave_search_name($save_search_name) {
		$this->save_search_name = $save_search_name;
	}

	public function getDate_from() {
		return $this->date_from;
	}

	public function setDate_from($date_from) {
		$this->date_from = $date_from;
	}

	public function getDate_to() {
		return $this->date_to;
	}

	public function setDate_to($date_to) {
		$this->date_to = $date_to;
	}

	public function getJob_title() {
		return $this->job_title;
	}

	public function setJob_title($job_title) {
		$this->job_title = $job_title;
	}

	public function getJobFunction() {
		return $this->jobFunction;
	}

	public function setJobFunction($jobFunction) {
		$this->jobFunction = $jobFunction;
	}

	public function getCountryRef() {
		return $this->countryRef;
	}

	public function setCountryRef($countryRef) {
		$this->countryRef = $countryRef;
	}

	public function getCity() {
		return $this->city;
	}

	public function setCity($city) {
		$this->city = $city;
	}

	public function getState() {
		return $this->state;
	}

	public function setState($state) {
		$this->state = $state;
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

	public function getSalaryRange() {
		return $this->salaryRange;
	}

	public function setSalaryRange($salaryRange) {
		$this->salaryRange = $salaryRange;
	}

	public function getJobType() {
		return $this->jobType;
	}

	public function setJobType($jobType) {
		$this->jobType = $jobType;
	}

	public function getExperieneceLevel() {
		return $this->experieneceLevel;
	}

	public function setExperieneceLevel($experieneceLevel) {
		$this->experieneceLevel = $experieneceLevel;
	}

	public function getRecieveAlerts() {
		return $this->recieveAlerts;
	}

	public function setRecieveAlerts($recieveAlerts) {
		$this->recieveAlerts = $recieveAlerts;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}

}