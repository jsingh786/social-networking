<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class education_detail
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
    private $duration_from;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     */
    private $duration_to;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $grade;

 	/**
     * @ORM\Column(type="string", length=1500, nullable=true)
     */
    private $acitivities;

    /**
     * @ORM\Column(type="string", length=1500, nullable=true)
     */
    private $notes;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $degree;

    /**
     * @ORM\Column(type="string", length=1024, nullable=true)
     */
    private $location;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\degree_ref", inversedBy="degreesEducation_detail")
     * @ORM\JoinColumn(name="degree_ref_id", referencedColumnName="id")
     */
    private $education_detailsDegree;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="usersEducation")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $educationsUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\field_of_study_ref", inversedBy="field_of_study_refEducation_detail")
     * @ORM\JoinColumn(name="field_of_study_ref_id", referencedColumnName="id")
     */
    private $education_detailsField_of_study_ref;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\school_ref", inversedBy="schoolsEducation_detail")
     * @ORM\JoinColumn(name="school_ref_id", referencedColumnName="id", nullable=false)
     */
    private $education_detailsSchool;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getDuration_from() {
		return $this->duration_from;
	}

	public function setDuration_from($duration_from) {
		$this->duration_from = $duration_from;
	}

	public function getDuration_to() {
		return $this->duration_to;
	}

	public function setDuration_to($duration_to) {
		$this->duration_to = $duration_to;
	}

	public function getGrade() {
		return $this->grade;
	}

	public function setGrade($grade) {
		$this->grade = $grade;
	}

	public function getAcitivities() {
		return $this->acitivities;
	}

	public function setAcitivities($acitivities) {
		$this->acitivities = $acitivities;
	}

	public function getNotes() {
		return $this->notes;
	}

	public function setNotes($notes) {
		$this->notes = $notes;
	}

	public function getDegree() {
		return $this->degree;
	}

	public function setDegree($degree) {
		$this->degree = $degree;
	}

	public function getLocation() {
		return $this->location;
	}

	public function setLocation($location) {
		$this->location = $location;
	}

	public function getEducation_detailsDegree() {
		return $this->education_detailsDegree;
	}

	public function setEducation_detailsDegree($education_detailsDegree) {
		$this->education_detailsDegree = $education_detailsDegree;
	}

	public function getEducationsUser() {
		return $this->educationsUser;
	}

	public function setEducationsUser($educationsUser) {
		$this->educationsUser = $educationsUser;
	}

	public function getEducation_detailsField_of_study_ref() {
		return $this->education_detailsField_of_study_ref;
	}

	public function setEducation_detailsField_of_study_ref($education_detailsField_of_study_ref) {
		$this->education_detailsField_of_study_ref = $education_detailsField_of_study_ref;
	}

	public function getEducation_detailsSchool() {
		return $this->education_detailsSchool;
	}

	public function setEducation_detailsSchool($education_detailsSchool) {
		$this->education_detailsSchool = $education_detailsSchool;
	}

}