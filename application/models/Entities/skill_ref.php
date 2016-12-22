<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 */
class skill_ref
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
    private $skill;

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
     * @ORM\OneToMany(targetEntity="Entities\support_skill", mappedBy="support_skillsSkill")
     */
    private $skillsSupport_skill;

    /**
     * @ORM\OneToMany(targetEntity="Entities\user_skills", mappedBy="user_skillsSkill")
     */
    private $skillsUser_skills;
    
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

	public function getSkill() {
		return $this->skill;
	}

	public function setSkill($skill) {
		$this->skill = $skill;
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

	public function getSkillsSupport_skill() {
		return $this->skillsSupport_skill;
	}

	public function setSkillsSupport_skill($skillsSupport_skill) {
		$this->skillsSupport_skill = $skillsSupport_skill;
	}

	public function getSkillsUser_skills() {
		return $this->skillsUser_skills;
	}

	public function setSkillsUser_skills($skillsUser_skills) {
		$this->skillsUser_skills = $skillsUser_skills;
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