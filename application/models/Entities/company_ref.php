<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class company_ref
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
    private $name;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $status;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $ilook_user_id;

    /**
     * @ORM\OneToMany(targetEntity="Entities\experience", mappedBy="experiencesCompany")
     */
    private $companysExperience;
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

	public function getIlook_user_id() {
		return $this->ilook_user_id;
	}

	public function setIlook_user_id($ilook_user_id) {
		$this->ilook_user_id = $ilook_user_id;
	}

	public function getCompanysExperience() {
		return $this->companysExperience;
	}

	public function setCompanysExperience($companysExperience) {
		$this->companysExperience = $companysExperience;
	}

}