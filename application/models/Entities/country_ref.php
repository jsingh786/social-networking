<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 * @ORM\Table(uniqueConstraints={@ORM\UniqueConstraint(name="namex", columns={"name"})})
 */
class country_ref
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
    private $name;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $status;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     */
    private $code;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $have_states;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     */
    private $currency_symbol;

    /**
     * @ORM\OneToMany(targetEntity="Entities\ilook_user", mappedBy="usersCountry")
     */
    private $countrysUser;

    /**
     * @ORM\OneToMany(targetEntity="Entities\job", mappedBy="countryRef")
     */
    private $job;

    /**
     * @ORM\OneToMany(targetEntity="Entities\state", mappedBy="countryRef")
     */
    private $state;

    /**
     * @ORM\OneToMany(targetEntity="Entities\city", mappedBy="countryRef")
     */
    private $city;

    /**
     * @ORM\OneToMany(targetEntity="Entities\salary_range", mappedBy="countryRef")
     */
    private $salaryRange;

    /**
     * @ORM\OneToMany(targetEntity="Entities\saved_search", mappedBy="countryRef")
     */
    private $savedSearch;
    
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getName() {
		return $this->name;
	}

	public function setName($name) {
		$this->name = $name;
	}

	public function getStatus() {
		return $this->status;
	}

	public function setStatus($status) {
		$this->status = $status;
	}

	public function getCode() {
		return $this->code;
	}

	public function setCode($code) {
		$this->code = $code;
	}

	public function getHave_states() {
		return $this->have_states;
	}

	public function setHave_states($have_states) {
		$this->have_states = $have_states;
	}

	public function getCurrency_symbol() {
		return $this->currency_symbol;
	}

	public function setCurrency_symbol($currency_symbol) {
		$this->currency_symbol = $currency_symbol;
	}

	public function getCountrysUser() {
		return $this->countrysUser;
	}

	public function setCountrysUser($countrysUser) {
		$this->countrysUser = $countrysUser;
	}

	public function getJob() {
		return $this->job;
	}

	public function setJob($job) {
		$this->job = $job;
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

	public function getSalaryRange() {
		return $this->salaryRange;
	}

	public function setSalaryRange($salaryRange) {
		$this->salaryRange = $salaryRange;
	}

	public function getSavedSearch() {
		return $this->savedSearch;
	}

	public function setSavedSearch($savedSearch) {
		$this->savedSearch = $savedSearch;
	}

}