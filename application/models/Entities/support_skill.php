<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 */
class support_skill
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $support_or_block;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\skill_ref", inversedBy="skillsSupport_skill")
     * @ORM\JoinColumn(name="skill_ref_id", referencedColumnName="id", nullable=false)
     */
    private $support_skillsSkill;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="supporter_usersSupport_skill")
     * @ORM\JoinColumn(name="supporter_id", referencedColumnName="id", nullable=false)
     */
    private $support_skillsSupporter_user;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="ilook_usersSupport_skill")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     */
    private $support_skillsIlook_user;
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

	public function getSupport_or_block() {
		return $this->support_or_block;
	}

	public function setSupport_or_block($support_or_block) {
		$this->support_or_block = $support_or_block;
	}

	public function getSupport_skillsSkill() {
		return $this->support_skillsSkill;
	}

	public function setSupport_skillsSkill($support_skillsSkill) {
		$this->support_skillsSkill = $support_skillsSkill;
	}

	public function getSupport_skillsSupporter_user() {
		return $this->support_skillsSupporter_user;
	}

	public function setSupport_skillsSupporter_user($support_skillsSupporter_user) {
		$this->support_skillsSupporter_user = $support_skillsSupporter_user;
	}

	public function getSupport_skillsIlook_user() {
		return $this->support_skillsIlook_user;
	}

	public function setSupport_skillsIlook_user($support_skillsIlook_user) {
		$this->support_skillsIlook_user = $support_skillsIlook_user;
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