<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class posted_to
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\wall_post", inversedBy="postedTo")
     * @ORM\JoinColumn(name="wall_post_id", referencedColumnName="id")
     */
    private $wallPost;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="postedTo")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id")
     */
    private $ilookUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getWallPost() {
		return $this->wallPost;
	}

	public function setWallPost($wallPost) {
		$this->wallPost = $wallPost;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}

}