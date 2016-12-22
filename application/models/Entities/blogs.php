<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class blogs
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
    private $url;

    /**
     * @ORM\Column(type="string", length=512, nullable=false)
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $blog_data;

    /**
     * @ORM\OneToMany(targetEntity="Entities\likes", mappedBy="blogs")
     */
    private $likeses;

    /**
     * @ORM\OneToMany(targetEntity="Entities\share", mappedBy="blogs")
     */
    private $shares;

    /**
     * @ORM\OneToMany(targetEntity="Entities\comments", mappedBy="blogs")
     */
    private $commentses;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="blogses")
     * @ORM\JoinColumn(name="blog_writer_id", referencedColumnName="id", nullable=false)
     */
    private $ilook_user;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\blog_categories", inversedBy="blogses")
     * @ORM\JoinColumn(name="blog_categories_id", referencedColumnName="id", nullable=false)
     */
    private $blog_categories;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getUrl() {
		return $this->url;
	}

	public function setUrl($url) {
		$this->url = $url;
	}

	public function getTitle() {
		return $this->title;
	}

	public function setTitle($title) {
		$this->title = $title;
	}

	public function getBlog_data() {
		return $this->blog_data;
	}

	public function setBlog_data($blog_data) {
		$this->blog_data = $blog_data;
	}

	public function getLikeses() {
		return $this->likeses;
	}

	public function setLikeses($likeses) {
		$this->likeses = $likeses;
	}

	public function getShares() {
		return $this->shares;
	}

	public function setShares($shares) {
		$this->shares = $shares;
	}

	public function getCommentses() {
		return $this->commentses;
	}

	public function setCommentses($commentses) {
		$this->commentses = $commentses;
	}

	public function getIlook_user() {
		return $this->ilook_user;
	}

	public function setIlook_user($ilook_user) {
		$this->ilook_user = $ilook_user;
	}

	public function getBlog_categories() {
		return $this->blog_categories;
	}

	public function setBlog_categories($blog_categories) {
		$this->blog_categories = $blog_categories;
	}

}