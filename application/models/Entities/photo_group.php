<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 */
class photo_group
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=1024, nullable=true)
     */
    private $description;

    /**
     * @ORM\OneToOne(targetEntity="Entities\wall_post", mappedBy="photoGroup", cascade={"remove"})
     */
    private $wallPost;

    /**
     * @ORM\OneToMany(targetEntity="Entities\likes", mappedBy="photoGroup", cascade={"remove"})
     */
    private $likes;

    /**
     * @ORM\OneToMany(targetEntity="Entities\share", mappedBy="photoGroup", cascade={"remove"})
     */
    private $share;

    /**
     * @ORM\OneToMany(targetEntity="Entities\socialise_photo", mappedBy="photoGroup", cascade={"remove"})
     */
    private $socialisePhoto;

    /**
     * @ORM\OneToMany(targetEntity="Entities\comments", mappedBy="photoGroup", cascade={"remove"})
     */
    private $comments;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="photoGroup")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $ilookUser;
    
    /**
     * @var datetime $created_at
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $created_at;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getDescription() {
		return $this->description;
	}

	public function setDescription($description) {
		$this->description = $description;
	}

	public function getWallPost() {
		return $this->wallPost;
	}

	public function setWallPost($wallPost) {
		$this->wallPost = $wallPost;
	}

	public function getLikes() {
		return $this->likes;
	}

	public function setLikes($likes) {
		$this->likes = $likes;
	}

	public function getShare() {
		return $this->share;
	}

	public function setShare($share) {
		$this->share = $share;
	}

	public function getSocialisePhoto() {
		return $this->socialisePhoto;
	}

	public function setSocialisePhoto($socialisePhoto) {
		$this->socialisePhoto = $socialisePhoto;
	}

	public function getComments() {
		return $this->comments;
	}

	public function setComments($comments) {
		$this->comments = $comments;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}

	public function getCreated_at() {
		return $this->created_at;
	}

	public function setCreated_at($created_at) {
		$this->created_at = $created_at;
	}

}