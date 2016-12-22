<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class default_news
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", nullable=false)
     */
    private $news_type;

    /**
     * @ORM\Column(type="integer", nullable=false)
     */
    private $user_id;
    
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getNews_type() {
		return $this->news_type;
	}

	public function setNews_type($news_type) {
		$this->news_type = $news_type;
	}

	public function getUser_id() {
		return $this->user_id;
	}

	public function setUser_id($user_id) {
		$this->user_id = $user_id;
	}

}