<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class experience
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $job_title;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $location;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $currently_work;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $job_startdate;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $job_enddate;

    /**
     * @ORM\Column(type="string", length=1500, nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $self_employed;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\company_ref", inversedBy="companysExperience")
     * @ORM\JoinColumn(name="company_ref_id", referencedColumnName="id", nullable=false)
     */
    private $experiencesCompany;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="usersExperience")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $experiencesUser;
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

	public function getLocation() {
		return $this->location;
	}

	public function setLocation($location) {
		$this->location = $location;
	}

	public function getCurrently_work() {
		return $this->currently_work;
	}

	public function setCurrently_work($currently_work) {
		$this->currently_work = $currently_work;
	}

	public function getJob_startdate() {
		return $this->job_startdate;
	}

	public function setJob_startdate($job_startdate) {
		$this->job_startdate = $job_startdate;
	}

	public function getJob_enddate() {
		return $this->job_enddate;
	}

	public function setJob_enddate($job_enddate) {
		$this->job_enddate = $job_enddate;
	}

	public function getDescription() {
		return $this->description;
	}

	public function setDescription($description) {
		$this->description = $description;
	}

	public function getSelf_employed() {
		return $this->self_employed;
	}

	public function setSelf_employed($self_employed) {
		$this->self_employed = $self_employed;
	}

	public function getExperiencesCompany() {
		return $this->experiencesCompany;
	}

	public function setExperiencesCompany($experiencesCompany) {
		$this->experiencesCompany = $experiencesCompany;
	}

	public function getExperiencesUser() {
		return $this->experiencesUser;
	}

	public function setExperiencesUser($experiencesUser) {
		$this->experiencesUser = $experiencesUser;
	}

}