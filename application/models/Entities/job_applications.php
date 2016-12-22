<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 */
class job_applications
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $is_applied;

    /**
     * @ORM\Column(type="string", length=1024, nullable=true)
     */
    private $applicant_msg;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $is_shortlist;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $is_report_abused;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $is_bookmarked;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $cv_attached;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $cover_letter_attached;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $applicant_email;

    /**
     * @ORM\Column(type="string", length=16, nullable=true)
     */
    private $applicant_ph_number;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\job", inversedBy="job_applications")
     * @ORM\JoinColumn(name="job_id", referencedColumnName="id", nullable=false)
     */
    private $job;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="jobApplications")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $ilookUser;
    
    /**
     * @var datetime $created_at
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $created_at;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getIs_applied() {
		return $this->is_applied;
	}

	public function setIs_applied($is_applied) {
		$this->is_applied = $is_applied;
	}

	public function getApplicant_msg() {
		return $this->applicant_msg;
	}

	public function setApplicant_msg($applicant_msg) {
		$this->applicant_msg = $applicant_msg;
	}

	public function getIs_shortlist() {
		return $this->is_shortlist;
	}

	public function setIs_shortlist($is_shortlist) {
		$this->is_shortlist = $is_shortlist;
	}

	public function getIs_report_abused() {
		return $this->is_report_abused;
	}

	public function setIs_report_abused($is_report_abused) {
		$this->is_report_abused = $is_report_abused;
	}

	public function getIs_bookmarked() {
		return $this->is_bookmarked;
	}

	public function setIs_bookmarked($is_bookmarked) {
		$this->is_bookmarked = $is_bookmarked;
	}

	public function getCv_attached() {
		return $this->cv_attached;
	}

	public function setCv_attached($cv_attached) {
		$this->cv_attached = $cv_attached;
	}

	public function getCover_letter_attached() {
		return $this->cover_letter_attached;
	}

	public function setCover_letter_attached($cover_letter_attached) {
		$this->cover_letter_attached = $cover_letter_attached;
	}

	public function getApplicant_email() {
		return $this->applicant_email;
	}

	public function setApplicant_email($applicant_email) {
		$this->applicant_email = $applicant_email;
	}

	public function getApplicant_ph_number() {
		return $this->applicant_ph_number;
	}

	public function setApplicant_ph_number($applicant_ph_number) {
		$this->applicant_ph_number = $applicant_ph_number;
	}

	public function getJob() {
		return $this->job;
	}

	public function setJob($job) {
		$this->job = $job;
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

}