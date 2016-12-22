<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class industry_ref
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
    private $title;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $status;

    /**
     * @ORM\OneToMany(targetEntity="Entities\ilook_user", mappedBy="usersIndustry")
     */
    private $industrysUser;

    /**
     * @ORM\OneToMany(targetEntity="Entities\job", mappedBy="industryRef")
     */
    private $job;

    /**
     * @ORM\OneToMany(targetEntity="Entities\saved_search", mappedBy="industryRef")
     */
    private $savedSearch;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getTitle() {
		return $this->title;
	}

	public function setTitle($title) {
		$this->title = $title;
	}

	public function getDescription() {
		return $this->description;
	}

	public function setDescription($description) {
		$this->description = $description;
	}

	public function getStatus() {
		return $this->status;
	}

	public function setStatus($status) {
		$this->status = $status;
	}

	public function getIndustrysUser() {
		return $this->industrysUser;
	}

	public function setIndustrysUser($industrysUser) {
		$this->industrysUser = $industrysUser;
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

}