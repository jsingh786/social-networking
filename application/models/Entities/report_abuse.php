<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class report_abuse
{
     /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $type;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="reportAbuse")
     * @ORM\JoinColumn(name="reporter_user_id", referencedColumnName="id", nullable=false)
     */
    private $ilookUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\wall_post", inversedBy="reportAbuse")
     * @ORM\JoinColumn(name="post_id", referencedColumnName="id")
     */
    private $wallPost;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="reportAbuseProfile")
     * @ORM\JoinColumn(name="profile_id", referencedColumnName="id")
     */
    private $profileUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}
	public function getType() {
		return $this->type;
	}

	public function setType($type) {
		$this->type = $type;
	}

	public function getWallPost() {
		return $this->wallPost;
	}

	public function setWallPost($wallPost) {
		$this->wallPost = $wallPost;
	}

	public function getProfileUser() {
		return $this->profileUser;
	}

	public function setProfileUser($profileUser) {
		$this->profileUser = $profileUser;
	}
}