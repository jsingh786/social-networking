<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class city
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
     * @ORM\OneToMany(targetEntity="Entities\ilook_user", mappedBy="city")
     */
    private $ilookUser;

    /**
     * @ORM\OneToMany(targetEntity="Entities\job", mappedBy="city")
     */
    private $job;

    /**
     * @ORM\OneToMany(targetEntity="Entities\saved_search", mappedBy="city")
     */
    private $savedSearch;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\state", inversedBy="city")
     * @ORM\JoinColumn(name="state_id", referencedColumnName="id")
     */
    private $state;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\country_ref", inversedBy="city")
     * @ORM\JoinColumn(name="country_ref_id", referencedColumnName="id", nullable=false)
     */
    private $countryRef;
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

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
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

	public function getState() {
		return $this->state;
	}

	public function setState($state) {
		$this->state = $state;
	}

	public function getCountryRef() {
		return $this->countryRef;
	}

	public function setCountryRef($countryRef) {
		$this->countryRef = $countryRef;
	}

}