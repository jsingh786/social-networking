<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class salary_range
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $min_salary;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $max_salary;

    /**
     * @ORM\OneToMany(targetEntity="Entities\job", mappedBy="salaryRange")
     */
    private $job;

    /**
     * @ORM\OneToMany(targetEntity="Entities\saved_search", mappedBy="salaryRange")
     */
    private $savedSearch;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\country_ref", inversedBy="salaryRange")
     * @ORM\JoinColumn(name="country_ref_id", referencedColumnName="id", nullable=false)
     */
    private $countryRef;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getMin_salary() {
		return $this->min_salary;
	}

	public function setMin_salary($min_salary) {
		$this->min_salary = $min_salary;
	}

	public function getMax_salary() {
		return $this->max_salary;
	}

	public function setMax_salary($max_salary) {
		$this->max_salary = $max_salary;
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

	public function getCountryRef() {
		return $this->countryRef;
	}

	public function setCountryRef($countryRef) {
		$this->countryRef = $countryRef;
	}

}